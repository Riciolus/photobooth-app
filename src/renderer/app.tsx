import { useEffect, useState } from "react"
import { SessionStage } from "src/shared/types"

type SessionState = {
  stage: SessionStage
  photos: number
}

export default function App() {
  const [session, setSession] = useState<SessionState | null>(null)
  

  useEffect(() => {
    window.api.onSessionUpdated(setSession)
  }, [])

  return (
  <div>
    <h1>Photobooth</h1>

    {session ? (
      <div>
        <p>Stage: {session.stage}</p>
        <p>Photos: {session.photos} / 3</p>
      </div>
    ) : (
      <p>Waiting for photos…</p>
    )}
  </div>
)
}
