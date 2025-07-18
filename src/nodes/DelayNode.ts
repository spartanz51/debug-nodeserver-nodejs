import { NanoSDK, NodeDefinition, NodeInstance } from '@nanograph/sdk'

// Helper function for sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const nodeDef: NodeDefinition = {
  uid: 'debug-node',
  name: 'Debug',
  category: 'Processing',
  version: '1.0.0',
  type: 'server',
  description: 'Delays the execution of the node for a specified amount of time',
  inputs: [
    {
      name: 'dummy_alpha',
      type: 'string',
      description: 'Dummy Alpha'
    },
    {
      name: 'dummy_bravo',
      type: 'string',
      description: 'Dummy Bravo'
    }
  ],
  outputs: [
    {
      name: 'dummy_charlie',
      type: 'string',
      description: 'Dummy Charlie'
    }
  ],
  parameters: []
}

const delayNode: NodeInstance = NanoSDK.registerNode(nodeDef)

delayNode.execute = async ({ inputs, parameters, context }) => {
  console.log(`[DelayNode DEBUG] Executing node ID #${context.graphNode.id} with inputs:`, JSON.stringify(inputs))

  const dummy_alpha = (inputs.dummy_alpha && inputs.dummy_alpha[0]) || ''
  const dummy_bravo = (inputs.dummy_bravo && inputs.dummy_bravo[0]) || ''
  const steps = 10

  for (let i = 0; i < steps; i++) {
    if (context.isAborted()) {
      console.log(`[DelayNode DEBUG] #${context.graphNode.id} execution aborted at step ${i + 1}.`)
      context.sendStatus({ type: 'error', message: `Execution aborted by request at step ${i + 1}.` })
      throw new Error('DelayNode execution aborted.')
    }
    
    await sleep(2)
    
    if (i % 2 === 0 || i === steps - 1) {
      context.sendStatus({
        type: 'running',
        message: `Processing step ${i + 1}/${steps}`,
        progress: { step: i + 1, total: steps }
      })
    }
  }

  console.log(`[DelayNode DEBUG] #${context.graphNode.id} result: '${dummy_alpha} ${dummy_bravo}'`)
  return { dummy_charlie: [dummy_alpha + ' ' + dummy_bravo] }
}

export default delayNode
