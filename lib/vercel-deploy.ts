type DeployTrigger = {
  ok: boolean
  message: string
}

export async function triggerVercelDeploy(reason: string): Promise<DeployTrigger> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hookUrl) {
    return {
      ok: false,
      message: "Saved locally. Set VERCEL_DEPLOY_HOOK_URL to auto-deploy live site.",
    }
  }

  try {
    const res = await fetch(hookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trigger: "admin-dashboard",
        reason,
        timestamp: new Date().toISOString(),
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        ok: false,
        message: `Saved, but deploy hook failed (${res.status}).`,
      }
    }

    return {
      ok: true,
      message: "Changes saved successfully. Live deploy started on Vercel.",
    }
  } catch {
    return {
      ok: false,
      message: "Saved, but could not reach Vercel deploy hook.",
    }
  }
}
