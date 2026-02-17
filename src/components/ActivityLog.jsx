export default function ActivityLog({ logs }) {
  return (
    <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Activity Log</h3>

      {logs.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No activity yet</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {logs.map((l) => (
            <div key={l.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 13 }}>{l.message}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(l.at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}