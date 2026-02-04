import { useEffect, useState } from "react";
import { SessionStage } from "src/shared/types";

type SessionState = {
  stage: SessionStage;
  photos: number;
};

export default function App() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    window.api.onSessionUpdated(setSession);
  }, []);

  useEffect(() => {
    window.api.onStripReady(() => {
      setVersion((v) => v + 1); // force reload
    });
  }, []);

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

      <img
        src={`/paper.png?v=${version}`}
        style={{ width: 300, border: "1px solid #ccc" }}
      />
    </div>
  );
}
