// app/dashboard/modules/digital-circuit/page.tsx
/**
 * Digital Circuit Fundamentals Module
 * 
 * Purpose:
 * - Interactive digital circuit simulator with logic gates
 * - Step-by-step progressive learning system
 * - Drag-and-drop gate placement and circuit building
 * - Real-time circuit simulation with visual feedback
 * - 6 progressive challenges from basic to advanced circuits
 * 
 * Features:
 * - Visual gate representation with input/output indicators
 * - Interactive input toggles with visual state
 * - Circuit simulation with proper gate logic
 * - Step progression with completion tracking
 * - Responsive design for all screen sizes
 */

'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================
// TYPE DEFINITIONS
// ===========================

/**
 * Represents a logic gate in the circuit
 */
interface Gate {
  id: string
  type: 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR'
  x: number
  y: number
  inputs: boolean[]
  output: boolean
}

/**
 * Complete circuit state including gates, inputs, and outputs
 */
interface Circuit {
  gates: Gate[]
  inputs: { [key: string]: boolean }
  outputs: { [key: string]: boolean }
}

/**
 * Configuration for each learning step
 */
interface StepConfig {
  title: string
  description: string
  requiredGates: string[]
  inputs: string[]
  outputs: string[]
}

// ===========================
// MAIN COMPONENT
// ===========================

export default function DigitalCircuitModule() {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [circuit, setCircuit] = useState<Circuit>({
    gates: [],
    inputs: {},
    outputs: {}
  })
  const [selectedGate, setSelectedGate] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentStep, setCurrentStep] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  // ===========================
  // MODULE CONFIGURATION
  // ===========================
  
  /**
   * Step-by-step learning progression
   * Each step introduces new gates and more complex circuits
   */
  const steps: StepConfig[] = [
    {
      title: "Traffic Light Controller",
      description: "Use AND, OR, and NOT gates to control traffic lights based on sensor inputs",
      requiredGates: ['AND', 'OR', 'NOT'],
      inputs: ['Sensor_A', 'Sensor_B', 'Emergency'],
      outputs: ['Red_Light', 'Yellow_Light', 'Green_Light']
    },
    {
      title: "Automatic Door Lock System", 
      description: "Use NAND, NOR, and XOR gates for secure access control",
      requiredGates: ['NAND', 'NOR', 'XOR'],
      inputs: ['Security_Sensor', 'Access_Key', 'Conflict_Detected'],
      outputs: ['Door_Unlock']
    },
    {
      title: "Burglar Alarm Circuit",
      description: "Combine multiple gates to create a reliable security alarm system",
      requiredGates: ['AND', 'NOT', 'OR', 'NOR'],
      inputs: ['Motion_Sensor', 'Door_Open', 'Override_Active'],
      outputs: ['Alarm_Trigger']
    },
    {
      title: "Smart Street Light System",
      description: "Use NAND, XNOR, and NOT gates for energy-efficient automation",
      requiredGates: ['NAND', 'XNOR', 'NOT'],
      inputs: ['Daylight_Sensor', 'Motion_Detected', 'Manual_Override'],
      outputs: ['Street_Light']
    },
    {
      title: "Half Adder Circuit",
      description: "Build a binary adder with XOR and AND gates for basic arithmetic",
      requiredGates: ['XOR', 'AND'],
      inputs: ['Bit_A', 'Bit_B'],
      outputs: ['Sum', 'Carry']
    },
    {
      title: "Full Adder Final Project",
      description: "Complete adder using all gate types for comprehensive learning",
      requiredGates: ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'],
      inputs: ['Bit_A', 'Bit_B', 'Carry_In'],
      outputs: ['Sum', 'Carry_Out']
    }
  ]

  // ===========================
  // GATE LOGIC FUNCTIONS
  // ===========================
  
  /**
   * Logic gate implementations with proper boolean logic
   */
  const gateFunctions = {
    AND: (a: boolean, b: boolean) => a && b,
    OR: (a: boolean, b: boolean) => a || b,
    NOT: (a: boolean) => !a,
    XOR: (a: boolean, b: boolean) => a !== b,
    NAND: (a: boolean, b: boolean) => !(a && b),
    NOR: (a: boolean, b: boolean) => !(a || b),
    XNOR: (a: boolean, b: boolean) => a === b
  }

  // ===========================
  // EVENT HANDLERS
  // ===========================

  /**
   * Add a new gate to the circuit at a random position
   */
  const addGate = (type: Gate['type']) => {
    const newGate: Gate = {
      id: `gate-${Date.now()}`,
      type,
      x: Math.random() * 400 + 50, // Random position within canvas
      y: Math.random() * 200 + 50,
      inputs: type === 'NOT' ? [false] : [false, false],
      output: false
    }
    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, newGate]
    }))
  }

  /**
   * Remove a gate from the circuit
   */
  const deleteGate = (gateId: string) => {
    setCircuit(prev => ({
      ...prev,
      gates: prev.gates.filter(g => g.id !== gateId)
    }))
  }

  /**
   * Start dragging a gate
   */
  const startDrag = (gateId: string, clientX: number, clientY: number) => {
    const gate = circuit.gates.find(g => g.id === gateId)
    if (gate) {
      setSelectedGate(gateId)
      setDragging(true)
      setDragOffset({
        x: clientX - gate.x,
        y: clientY - gate.y
      })
    }
  }

  /**
   * Handle gate dragging movement
   */
  const onDrag = (clientX: number, clientY: number) => {
    if (dragging && selectedGate) {
      setCircuit(prev => ({
        ...prev,
        gates: prev.gates.map(gate => 
          gate.id === selectedGate 
            ? { ...gate, x: clientX - dragOffset.x, y: clientY - dragOffset.y }
            : gate
        )
      }))
    }
  }

  /**
   * End gate dragging
   */
  const endDrag = () => {
    setDragging(false)
    setSelectedGate(null)
  }

  /**
   * Toggle input state
   */
  const toggleInput = (inputName: string) => {
    setCircuit(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [inputName]: !prev.inputs[inputName]
      }
    }))
  }

  /**
   * Simulate the entire circuit and update gate outputs
   */
  const simulateCircuit = () => {
    const updatedGates = [...circuit.gates]
    
    // Process each gate and calculate its output
    updatedGates.forEach(gate => {
      let result = false
      
      // Use external inputs or gate outputs as inputs
      const inputA = circuit.inputs[gate.inputs[0] as any] || gate.inputs[0] || false
      const inputB = gate.type !== 'NOT' ? (circuit.inputs[gate.inputs[1] as any] || gate.inputs[1] || false) : false
      
      // Calculate output based on gate type
      switch (gate.type) {
        case 'AND':
          result = inputA && inputB
          break
        case 'OR':
          result = inputA || inputB
          break
        case 'NOT':
          result = !inputA
          break
        case 'XOR':
          result = inputA !== inputB
          break
        case 'NAND':
          result = !(inputA && inputB)
          break
        case 'NOR':
          result = !(inputA || inputB)
          break
        case 'XNOR':
          result = inputA === inputB
          break
      }
      
      gate.output = result
    })

    // Update outputs based on gate results
    const newOutputs = { ...circuit.outputs }
    updatedGates.forEach((gate, index) => {
      const outputKey = `Output_${index + 1}`
      newOutputs[outputKey] = gate.output
    })

    setCircuit(prev => ({ 
      ...prev, 
      gates: updatedGates,
      outputs: newOutputs
    }))
  }

  /**
   * Reset the entire circuit to empty state
   */
  const resetCircuit = () => {
    setCircuit({
      gates: [],
      inputs: {},
      outputs: {}
    })
  }

  // ===========================
  // EFFECTS AND EVENT LISTENERS
  // ===========================

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDrag(e.clientX, e.clientY)
    const handleMouseUp = () => endDrag()

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  // Initialize inputs for current step
  useEffect(() => {
    const currentStepConfig = steps[currentStep - 1]
    if (currentStepConfig) {
      const initialInputs: { [key: string]: boolean } = {}
      currentStepConfig.inputs.forEach(input => {
        initialInputs[input] = false
      })
      
      const initialOutputs: { [key: string]: boolean } = {}
      currentStepConfig.outputs.forEach(output => {
        initialOutputs[output] = false
      })

      setCircuit(prev => ({
        ...prev,
        inputs: initialInputs,
        outputs: initialOutputs
      }))
    }
  }, [currentStep])

  // ===========================
  // RENDER
  // ===========================

  const currentStepConfig = steps[currentStep - 1]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Digital Circuit Fundamentals</h1>
          <p className="text-gray-300 text-lg">Build, simulate, and master digital logic circuits</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mt-4">
            <span>Step {currentStep} of 6</span>
            <span>•</span>
            <span>Interactive Simulation</span>
            <span>•</span>
            <span>Drag & Drop</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between mb-2 text-sm">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`text-center px-4 py-2 rounded-lg transition-colors ${
                  index + 1 === currentStep
                    ? 'bg-blue-600 text-white'
                    : index + 1 < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                Step {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls and Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Step Information */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">{currentStepConfig.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{currentStepConfig.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-400 mb-2">Required Gates:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStepConfig.requiredGates.map(gate => (
                      <span key={gate} className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                        {gate}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gate Palette */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-white">Gate Palette</h3>
              <p className="text-gray-400 text-sm mb-3">Click to add gates to your circuit</p>
              <div className="grid grid-cols-2 gap-2">
                {['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'].map(gateType => (
                  <button
                    key={gateType}
                    onClick={() => addGate(gateType as Gate['type'])}
                    className="bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {gateType}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-white">Circuit Inputs</h3>
              <p className="text-gray-400 text-sm mb-3">Toggle inputs to test your circuit</p>
              <div className="space-y-3">
                {currentStepConfig.inputs.map(input => (
                  <div key={input} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{input}</span>
                    <button
                      onClick={() => toggleInput(input)}
                      className={`w-14 h-7 rounded-full transition-colors relative ${
                        circuit.inputs[input] ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                        circuit.inputs[input] ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={simulateCircuit}
                className="w-full bg-green-600 hover:bg-green-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🚀 Run Simulation
              </button>
              <button
                onClick={resetCircuit}
                className="w-full bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🔄 Reset Circuit
              </button>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Circuit Canvas</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                    disabled={currentStep === 6}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Interactive Circuit Canvas */}
              <div
                ref={canvasRef}
                className="border-2 border-dashed border-gray-600 rounded-xl h-96 bg-gray-900 relative overflow-auto"
                onMouseMove={(e) => dragging && onDrag(e.clientX, e.clientY)}
                onMouseUp={endDrag}
              >
                {circuit.gates.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <div className="text-6xl mb-4">⚡</div>
                    <p className="text-xl mb-2">Your Circuit Canvas</p>
                    <p className="text-sm">Drag gates from the palette to start building</p>
                  </div>
                )}

                {/* Render Interactive Gates */}
                {circuit.gates.map(gate => (
                  <div
                    key={gate.id}
                    className={`absolute bg-gray-700 border-2 rounded-xl p-4 cursor-move select-none shadow-lg transition-all ${
                      selectedGate === gate.id 
                        ? 'border-blue-400 scale-105 shadow-xl' 
                        : 'border-gray-500 hover:border-gray-400'
                    }`}
                    style={{ 
                      left: gate.x, 
                      top: gate.y,
                      minWidth: '120px'
                    }}
                    onMouseDown={(e) => startDrag(gate.id, e.clientX, e.clientY)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-lg text-white">{gate.type}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteGate(gate.id)
                        }}
                        className="text-red-400 hover:text-red-300 text-lg font-bold transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Input Indicators */}
                    <div className="space-y-2 mb-3">
                      {gate.inputs.map((input, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            input ? 'bg-green-400 border-green-400' : 'bg-red-400 border-red-400'
                          }`} />
                          <span className="text-xs text-gray-300">Input {index + 1}</span>
                        </div>
                      ))}
                    </div>

                    {/* Output Indicator */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        gate.output ? 'bg-green-400 border-green-400 animate-pulse' : 'bg-red-400 border-red-400'
                      }`} />
                      <span className="text-xs text-gray-300">Output</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Output Display */}
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-white text-lg">Circuit Outputs</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentStepConfig.outputs.map(output => (
                    <div key={output} className="flex items-center space-x-3 bg-gray-600 p-3 rounded-lg">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        circuit.outputs[output] 
                          ? 'bg-green-400 border-green-400 animate-pulse' 
                          : 'bg-red-400 border-red-400'
                      }`} />
                      <span className="text-sm font-medium">{output}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}