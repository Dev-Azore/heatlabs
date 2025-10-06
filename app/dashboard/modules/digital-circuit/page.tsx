// app/dashboard/modules/digital-circuit/page.tsx
/**
 * Digital Circuit Fundamentals Module
 * 
 * Enhanced Features:
 * - Step-by-step progressive learning with completion tracking
 * - Realistic gate symbols with proper visual representation
 * - Drag-and-drop with wire connections
 * - Real-time simulation with visual feedback
 * - Professional traffic light and output displays
 * - Fully responsive design
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ===========================
// TYPE DEFINITIONS
// ===========================

interface Gate {
  id: string
  type: 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR'
  x: number
  y: number
  inputs: (string | null)[]
  output: boolean
  rotation: number
}

interface Wire {
  id: string
  from: { gateId: string; outputIndex: number }
  to: { gateId: string; inputIndex: number }
}

interface Circuit {
  gates: Gate[]
  wires: Wire[]
  inputs: { [key: string]: boolean }
  outputs: { [key: string]: boolean }
}

interface StepConfig {
  id: number
  title: string
  description: string
  requiredGates: Gate['type'][]
  inputs: string[]
  outputs: string[]
  expectedOutput?: { [key: string]: boolean }
  instructions: string[]
  completed: boolean
}

// ===========================
// GATE VISUAL CONFIGURATION
// ===========================

const GATE_CONFIG = {
  AND: {
    shape: 'M10,20 L10,80 L70,50 Z',
    symbol: '&',
    inputs: 2,
    color: '#3B82F6'
  },
  OR: {
    shape: 'M10,20 Q50,20 70,50 Q50,80 10,80 Q30,50 10,20',
    symbol: '≥1',
    inputs: 2,
    color: '#10B981'
  },
  NOT: {
    shape: 'M10,20 L10,80 L60,50 Z',
    symbol: '1',
    inputs: 1,
    color: '#EF4444'
  },
  XOR: {
    shape: 'M15,20 Q50,20 70,50 Q50,80 15,80 Q35,50 15,20',
    symbol: '=1',
    inputs: 2,
    color: '#8B5CF6'
  },
  NAND: {
    shape: 'M10,20 L10,80 L70,50 Z',
    symbol: '&',
    inputs: 2,
    color: '#F59E0B'
  },
  NOR: {
    shape: 'M10,20 Q50,20 70,50 Q50,80 10,80 Q30,50 10,20',
    symbol: '≥1',
    inputs: 2,
    color: '#EC4899'
  },
  XNOR: {
    shape: 'M15,20 Q50,20 70,50 Q50,80 15,80 Q35,50 15,20',
    symbol: '=',
    inputs: 2,
    color: '#06B6D4'
  }
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
    wires: [],
    inputs: {},
    outputs: {}
  })
  const [selectedGate, setSelectedGate] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentStep, setCurrentStep] = useState(1)
  const [drawingWire, setDrawingWire] = useState<{ from: string; outputIndex: number } | null>(null)
  const [hoveredPin, setHoveredPin] = useState<{ gateId: string; type: 'input' | 'output'; index: number } | null>(null)
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // ===========================
  // STEP CONFIGURATION
  // ===========================
  const [steps, setSteps] = useState<StepConfig[]>([
    {
      id: 1,
      title: "Basic Logic Gates",
      description: "Learn AND, OR, and NOT gates by building simple circuits",
      requiredGates: ['AND', 'OR', 'NOT'],
      inputs: ['A', 'B'],
      outputs: ['Output'],
      instructions: [
        "Drag AND, OR, and NOT gates from the palette",
        "Connect gates by dragging from output to input pins",
        "Toggle input switches to test your circuit",
        "Create a circuit where Output = (A AND B) OR (NOT A)"
      ],
      completed: false
    },
    {
      id: 2,
      title: "Traffic Light Controller", 
      description: "Use AND, OR, and NOT gates to control traffic lights based on sensor inputs",
      requiredGates: ['AND', 'OR', 'NOT'],
      inputs: ['Sensor_A', 'Sensor_B', 'Emergency'],
      outputs: ['Red_Light', 'Yellow_Light', 'Green_Light'],
      instructions: [
        "Design a traffic light controller system",
        "Use sensor inputs to control light states",
        "Emergency input should make all lights red",
        "Connect outputs to the traffic light display"
      ],
      completed: false
    },
    {
      id: 3,
      title: "Automatic Door Lock System", 
      description: "Use NAND, NOR, and XOR gates for secure access control",
      requiredGates: ['NAND', 'NOR', 'XOR'],
      inputs: ['Security_Sensor', 'Access_Key', 'Conflict_Detected'],
      outputs: ['Door_Unlock'],
      instructions: [
        "Build a secure door lock system",
        "Door unlocks only with valid access key and clear sensor",
        "Conflict detection should prevent unlocking",
        "Use the new gate types effectively"
      ],
      completed: false
    },
    {
      id: 4,
      title: "Burglar Alarm Circuit",
      description: "Combine multiple gates to create a reliable security alarm system",
      requiredGates: ['AND', 'NOT', 'OR', 'NOR'],
      inputs: ['Motion_Sensor', 'Door_Open', 'Override_Active'],
      outputs: ['Alarm_Trigger'],
      instructions: [
        "Create a burglar alarm system",
        "Alarm triggers on motion OR open door",
        "Override switch disables the alarm",
        "Ensure proper logic for security"
      ],
      completed: false
    },
    {
      id: 5,
      title: "Half Adder Circuit",
      description: "Build a binary adder with XOR and AND gates for basic arithmetic",
      requiredGates: ['XOR', 'AND'],
      inputs: ['Bit_A', 'Bit_B'],
      outputs: ['Sum', 'Carry'],
      instructions: [
        "Construct a half adder circuit",
        "XOR gate calculates the sum bit",
        "AND gate calculates the carry bit",
        "Test with all input combinations (00, 01, 10, 11)"
      ],
      completed: false
    },
    {
      id: 6,
      title: "Full Adder Final Project",
      description: "Complete adder using all gate types for comprehensive learning",
      requiredGates: ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'],
      inputs: ['Bit_A', 'Bit_B', 'Carry_In'],
      outputs: ['Sum', 'Carry_Out'],
      instructions: [
        "Build a full adder circuit",
        "Handle three inputs with proper carry propagation",
        "Use any combination of gates",
        "Verify all 8 possible input combinations"
      ],
      completed: false
    }
  ])

  // ===========================
  // GATE LOGIC FUNCTIONS
  // ===========================
  const calculateGateOutput = useCallback((gate: Gate, inputs: boolean[]): boolean => {
    switch (gate.type) {
      case 'AND': return inputs[0] && inputs[1]
      case 'OR': return inputs[0] || inputs[1]
      case 'NOT': return !inputs[0]
      case 'XOR': return inputs[0] !== inputs[1]
      case 'NAND': return !(inputs[0] && inputs[1])
      case 'NOR': return !(inputs[0] || inputs[1])
      case 'XNOR': return inputs[0] === inputs[1]
      default: return false
    }
  }, [])

  // ===========================
  // CIRCUIT SIMULATION
  // ===========================
  const simulateCircuit = useCallback(() => {
    const updatedGates = [...circuit.gates]
    const gateOutputs = new Map<string, boolean>()
    
    // Calculate outputs for all gates
    let changed = true
    for (let i = 0; i < 10 && changed; i++) {
      changed = false
      updatedGates.forEach(gate => {
        const inputValues = gate.inputs.map(input => {
          if (input === null) return false
          if (input.startsWith('input:')) {
            const inputName = input.split(':')[1]
            return circuit.inputs[inputName] || false
          }
          if (input.startsWith('gate:')) {
            const [_, gateId, outputIndex] = input.split(':')
            return gateOutputs.get(`${gateId}:${outputIndex}`) || false
          }
          return false
        })
        
        const newOutput = calculateGateOutput(gate, inputValues)
        const oldOutput = gateOutputs.get(`${gate.id}:0`)
        
        if (oldOutput !== newOutput) {
          changed = true
          gateOutputs.set(`${gate.id}:0`, newOutput)
          gate.output = newOutput
        }
      })
    }

    // Update circuit outputs based on connected gates
    const newOutputs = { ...circuit.outputs }
    Object.keys(newOutputs).forEach(outputName => {
      // Find gates connected to this output
      const outputGates = circuit.gates.filter(gate => 
        gate.inputs.some(input => input === `output:${outputName}`)
      )
      if (outputGates.length > 0) {
        newOutputs[outputName] = outputGates.some(gate => gate.output)
      }
    })

    setCircuit(prev => ({ 
      ...prev, 
      gates: updatedGates,
      outputs: newOutputs
    }))

    // Check if current step is completed
    checkStepCompletion(updatedGates, newOutputs)
  }, [circuit, calculateGateOutput])

  const checkStepCompletion = useCallback((gates: Gate[], outputs: { [key: string]: boolean }) => {
    // Simple completion check - circuit has gates and produces some output
    if (gates.length > 0 && Object.values(outputs).some(val => val)) {
      setSteps(prev => prev.map(step => 
        step.id === currentStep ? { ...step, completed: true } : step
      ))
    }
  }, [currentStep])

  // ===========================
  // GATE MANAGEMENT
  // ===========================
  const addGate = (type: Gate['type']) => {
    const newGate: Gate = {
      id: `gate-${Date.now()}`,
      type,
      x: 200 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      inputs: new Array(GATE_CONFIG[type].inputs).fill(null),
      output: false,
      rotation: 0
    }
    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, newGate]
    }))
  }

  const deleteGate = (gateId: string) => {
    setCircuit(prev => ({
      ...prev,
      gates: prev.gates.filter(g => g.id !== gateId),
      wires: prev.wires.filter(w => w.from.gateId !== gateId && w.to.gateId !== gateId)
    }))
  }

  // ===========================
  // DRAG AND DROP
  // ===========================
  const startDrag = (gateId: string, clientX: number, clientY: number) => {
    const gate = circuit.gates.find(g => g.id === gateId)
    if (gate) {
      setSelectedGate(gateId)
      setDragging(true)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: clientX - rect.left - gate.x,
          y: clientY - rect.top - gate.y
        })
      }
    }
  }

  const onDrag = (clientX: number, clientY: number) => {
    if (dragging && selectedGate && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCircuit(prev => ({
        ...prev,
        gates: prev.gates.map(gate => 
          gate.id === selectedGate 
            ? { 
                ...gate, 
                x: Math.max(0, Math.min(clientX - rect.left - dragOffset.x, rect.width - 80)),
                y: Math.max(0, Math.min(clientY - rect.top - dragOffset.y, rect.height - 60))
              }
            : gate
        )
      }))
    }
  }

  const endDrag = () => {
    setDragging(false)
    setSelectedGate(null)
  }

  // ===========================
  // WIRE MANAGEMENT
  // ===========================
  const startWire = (gateId: string, outputIndex: number) => {
    setDrawingWire({ from: gateId, outputIndex })
  }

  const connectWire = (toGateId: string, inputIndex: number) => {
    if (drawingWire) {
      const fromGate = circuit.gates.find(g => g.id === drawingWire.from)
      const toGate = circuit.gates.find(g => g.id === toGateId)
      
      if (fromGate && toGate && fromGate.id !== toGate.id) {
        // Update the input connection
        setCircuit(prev => ({
          ...prev,
          gates: prev.gates.map(gate => 
            gate.id === toGateId 
              ? {
                  ...gate,
                  inputs: gate.inputs.map((input, idx) => 
                    idx === inputIndex ? `gate:${drawingWire.from}:${drawingWire.outputIndex}` : input
                  )
                }
              : gate
          )
        }))
      }
      setDrawingWire(null)
      setHoveredPin(null)
    }
  }

  const cancelWire = () => {
    setDrawingWire(null)
    setHoveredPin(null)
  }

  // ===========================
  // INPUT/OUTPUT MANAGEMENT
  // ===========================
  const toggleInput = (inputName: string) => {
    setCircuit(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [inputName]: !prev.inputs[inputName]
      }
    }))
  }

  const resetCircuit = () => {
    setCircuit({
      gates: [],
      wires: [],
      inputs: {},
      outputs: {}
    })
  }

  // ===========================
  // EFFECTS
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

  useEffect(() => {
    // Initialize inputs for current step
    const currentStepConfig = steps.find(step => step.id === currentStep)
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
  }, [currentStep, steps])

  // Auto-simulate when circuit changes
  useEffect(() => {
    if (circuit.gates.length > 0) {
      simulateCircuit()
    }
  }, [circuit.inputs, circuit.gates, circuit.wires, simulateCircuit])

  // ===========================
  // RENDER FUNCTIONS
  // ===========================
  const renderGate = (gate: Gate) => {
    const config = GATE_CONFIG[gate.type]
    const isSelected = selectedGate === gate.id
    
    return (
      <div
        key={gate.id}
        className={`absolute cursor-move select-none transition-all ${
          isSelected ? 'scale-105 shadow-2xl' : 'shadow-lg'
        }`}
        style={{ 
          left: gate.x, 
          top: gate.y,
          transform: `rotate(${gate.rotation}deg)`
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          startDrag(gate.id, e.clientX, e.clientY)
        }}
      >
        {/* Gate Body */}
        <div className="relative">
          <svg width="80" height="60" className="pointer-events-none">
            {/* Gate shape */}
            <path
              d={config.shape}
              fill={config.color}
              stroke={isSelected ? '#ffffff' : '#1f2937'}
              strokeWidth="2"
              fillOpacity="0.9"
            />
            
            {/* Gate symbol */}
            <text
              x="40"
              y="35"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              className="select-none"
            >
              {config.symbol}
            </text>

            {/* Input pins */}
            {Array.from({ length: config.inputs }).map((_, index) => (
              <circle
                key={`input-${index}`}
                cx="5"
                cy={15 + index * 20}
                r="4"
                fill={gate.inputs[index] ? '#10B981' : '#6B7280'}
                stroke="white"
                strokeWidth="1"
                className="cursor-crosshair hover:r-5 transition-all"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  if (drawingWire) {
                    connectWire(gate.id, index)
                  }
                }}
                onMouseEnter={() => setHoveredPin({ gateId: gate.id, type: 'input', index })}
                onMouseLeave={() => setHoveredPin(null)}
              />
            ))}

            {/* Output pin */}
            <circle
              cx="75"
              cy="30"
              r="4"
              fill={gate.output ? '#10B981' : '#6B7280'}
              stroke="white"
              strokeWidth="1"
              className="cursor-crosshair hover:r-5 transition-all"
              onMouseDown={(e) => {
                e.stopPropagation()
                startWire(gate.id, 0)
              }}
              onMouseEnter={() => setHoveredPin({ gateId: gate.id, type: 'output', index: 0 })}
              onMouseLeave={() => setHoveredPin(null)}
            />
          </svg>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteGate(gate.id)
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  const renderWires = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none">
        {circuit.gates.flatMap(gate => 
          gate.inputs.map((input, inputIndex) => {
            if (!input || !input.startsWith('gate:')) return null
            
            const [_, fromGateId, outputIndex] = input.split(':')
            const fromGate = circuit.gates.find(g => g.id === fromGateId)
            const toGate = gate
            
            if (!fromGate) return null

            const startX = fromGate.x + 75
            const startY = fromGate.y + 30
            const endX = toGate.x + 5
            const endY = toGate.y + 15 + inputIndex * 20

            return (
              <path
                key={`wire-${fromGateId}-${toGate.id}-${inputIndex}`}
                d={`M ${startX} ${startY} C ${startX + 50} ${startY} ${endX - 50} ${endY} ${endX} ${endY}`}
                stroke={fromGate.output ? '#10B981' : '#6B7280'}
                strokeWidth="2"
                fill="none"
                strokeDasharray={fromGate.output ? "0" : "5,5"}
              />
            )
          })
        )}
        
        {/* Drawing wire preview */}
        {drawingWire && (
          <path
            d={`M ${circuit.gates.find(g => g.id === drawingWire.from)!.x + 75} ${
              circuit.gates.find(g => g.id === drawingWire.from)!.y + 30
            } L ${hoveredPin ? hoveredPin.gateId === drawingWire.from ? 0 : 0 : 0} ${
              hoveredPin ? hoveredPin.gateId === drawingWire.from ? 0 : 0 : 0
            }`}
            stroke="#60A5FA"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        )}
      </svg>
    )
  }

  const currentStepConfig = steps.find(step => step.id === currentStep)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Digital Circuit Fundamentals
          </h1>
          <p className="text-gray-300 text-lg">Interactive learning through hands-on circuit building</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Learning Path</h2>
            <span className="text-sm text-gray-400">Step {currentStep} of 6</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  step.id === currentStep
                    ? 'bg-blue-600 shadow-lg scale-105'
                    : step.completed
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${step.id > currentStep && !step.completed ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Step {step.id}</span>
                  {step.completed && <span>✅</span>}
                </div>
                <p className="text-xs text-gray-200">{step.title}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Step Instructions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">
                {currentStepConfig.title}
              </h3>
              <p className="text-gray-300 mb-4">{currentStepConfig.description}</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-400">Instructions:</h4>
                <ul className="space-y-2 text-sm">
                  {currentStepConfig.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gate Palette */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 text-white">Available Gates</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentStepConfig.requiredGates.map(gateType => {
                  const config = GATE_CONFIG[gateType]
                  return (
                    <button
                      key={gateType}
                      onClick={() => addGate(gateType)}
                      className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
                    >
                      <div className="flex flex-col items-center">
                        <svg width="40" height="30" className="mb-2">
                          <path
                            d={config.shape}
                            fill={config.color}
                            stroke="#1f2937"
                            strokeWidth="1.5"
                          />
                          <text
                            x="20"
                            y="18"
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {config.symbol}
                          </text>
                        </svg>
                        <span className="text-xs font-medium text-gray-200">{gateType}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 text-white">Input Controls</h3>
              <div className="space-y-3">
                {currentStepConfig.inputs.map(input => (
                  <div key={input} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">{input}</span>
                    <button
                      onClick={() => toggleInput(input)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        circuit.inputs[input] ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          circuit.inputs[input] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={simulateCircuit}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                🔄 Run Simulation
              </button>
              <button
                onClick={resetCircuit}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                🗑️ Clear Circuit
              </button>
              {drawingWire && (
                <button
                  onClick={cancelWire}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  ❌ Cancel Wire
                </button>
              )}
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Circuit Workspace</h3>
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
                    disabled={currentStep === 6 || !steps.find(s => s.id === currentStep)?.completed}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Circuit Canvas */}
              <div
                ref={canvasRef}
                className="relative border-2 border-dashed border-gray-600 rounded-xl h-96 bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto"
                onMouseMove={(e) => dragging && onDrag(e.clientX, e.clientY)}
                onMouseUp={endDrag}
                onMouseLeave={cancelWire}
              >
                {renderWires()}
                
                {circuit.gates.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <div className="text-6xl mb-4">⚡</div>
                    <p className="text-xl mb-2">Build Your Circuit</p>
                    <p className="text-sm text-center max-w-md">
                      Drag gates from the palette and connect them to create your digital circuit
                    </p>
                  </div>
                )}

                {circuit.gates.map(renderGate)}
              </div>

              {/* Output Display */}
              <div className="mt-6">
                <h4 className="font-semibold mb-4 text-white text-lg">Circuit Output</h4>
                
                {/* Traffic Light Display for Step 2 */}
                {currentStep === 2 && (
                  <div className="bg-gray-700 rounded-lg p-6 mb-4">
                    <div className="flex justify-center space-x-8">
                      <div className="text-center">
                        <div className="bg-black p-4 rounded-lg inline-block">
                          <div className={`w-12 h-12 rounded-full mb-2 transition-all ${
                            circuit.outputs.Red_Light ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-red-900'
                          }`} />
                          <div className={`w-12 h-12 rounded-full mb-2 transition-all ${
                            circuit.outputs.Yellow_Light ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-yellow-900'
                          }`} />
                          <div className={`w-12 h-12 rounded-full transition-all ${
                            circuit.outputs.Green_Light ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-green-900'
                          }`} />
                        </div>
                        <p className="text-sm mt-2 text-gray-300">Traffic Light</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Standard Output Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentStepConfig.outputs.map(output => (
                    <div key={output} className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 transition-all ${
                        circuit.outputs[output] 
                          ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
                          : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-200">{output}</span>
                      <div className="text-xs text-gray-400 mt-1">
                        {circuit.outputs[output] ? 'ON' : 'OFF'}
                      </div>
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