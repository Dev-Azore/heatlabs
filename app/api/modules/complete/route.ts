// app/api/modules/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer' // Corrected import - using named export

/**
 * POST /api/modules/complete
 * Marks a module as completed for the authenticated user
 * Required in request body: moduleId, labId
 */
export async function POST(request: NextRequest) {
  try {
    // Use the directly imported supabaseServer instance
    // No need to call a function since it's already an initialized client
    
    // Check if user is authenticated using the service role client
    // Note: Service role client bypasses RLS, so we need to explicitly check auth
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser()
    
    // If authentication fails or no user found, return 401 Unauthorized
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be signed in to complete modules' },
        { status: 401 }
      )
    }

    // Parse the request body to get module and lab information
    const { moduleId, labId } = await request.json()

    // Validate required fields
    if (!moduleId || !labId) {
      return NextResponse.json(
        { error: 'Module ID and Lab ID are required' },
        { status: 400 }
      )
    }

    /**
     * Save completion progress to database using service role client
     * This bypasses RLS, so ensure proper validation is done above
     * Uses upsert to handle both new completions and updates to existing progress
     * onConflict ensures we update existing records for the same user/module combination
     */
    const { data, error } = await supabaseServer
      .from('user_progress')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        lab_id: labId,
        completed: true,
        completed_at: new Date().toISOString(), // Timestamp when module was completed
      }, {
        onConflict: 'user_id,module_id' // Update if record already exists for this user/module
      })

    // Handle database errors
    if (error) {
      console.error('Error saving progress to database:', error)
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Module completed successfully!',
      data: data // Optional: include the saved data in response
    })
    
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in module completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/modules/complete?moduleId=:moduleId
 * Retrieves completion status for a specific module for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')

    // Check authentication
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    // Query user progress for the specific module
    const { data, error } = await supabaseServer
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching progress:', error)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      completed: !!data?.completed,
      progress: data
    })

  } catch (error) {
    console.error('Error fetching module progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}