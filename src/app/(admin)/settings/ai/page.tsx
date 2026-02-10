import { getSystemSetting } from '@/lib/actions/settings'
import { ModelSelector } from '@/components/admin/model-selector'

export default async function AISettingsPage() {
  const config = await getSystemSetting('ai_model_config') || {
    provider: 'openrouter',
    modelId: 'openai/gpt-4o-mini',
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Configuration</h1>
        <p className="text-muted-foreground">
          Manage how the AI interacts with visitors on your portfolio.
        </p>
      </div>
      <div className="grid gap-6 max-w-2xl">
        <ModelSelector initialConfig={config} />
      </div>
    </div>
  )
}
