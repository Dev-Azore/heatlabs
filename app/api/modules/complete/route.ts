// app/api/modules/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be signed in to complete modules' },
        { status: 401 }
      )
    }

    const { moduleId, labId } = await request.json()

    if (!moduleId || !labId) {
      return NextResponse.json(
        { error: 'Module ID and Lab ID are required' },
        { status: 400 }
      )
    }

    // Save completion to database
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        lab_id: labId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,module_id'
      })

    if (error) {
      console.error('Error saving progress:', error)
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Module completed successfully!' 
    })
  } catch (error) {
    console.error('Module completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}