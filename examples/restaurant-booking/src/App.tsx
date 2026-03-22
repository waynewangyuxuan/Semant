import { useState } from "react";
import {
  SemanticProvider,
  SemanticSelect,
  SemanticDatePicker,
  SemanticTextInput,
  SemanticAction,
  SemanticInfo,
  SemanticHead,
  SemanticBridge,
  useSemanticPage,
  toPlainText,
} from "@semant/react";
import "./App.css";

function today() {
  return new Date().toISOString().split("T")[0];
}

function maxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().split("T")[0];
}

function App() {
  const [size, setSize] = useState<number>(2);
  const [date, setDate] = useState<string>(today());
  const [time, setTime] = useState<string | number | null>(null);
  const [name, setName] = useState("");
  const [booked, setBooked] = useState(false);

  const canSubmit = size > 0 && date && time && name.length > 0;

  if (booked) {
    return (
      <div className="app">
        <div className="card success">
          <h1>Booking Confirmed</h1>
          <p>
            {name}, party of {size}
            <br />
            {date} at {time}
          </p>
          <button onClick={() => setBooked(false)}>Book Another</button>
        </div>
      </div>
    );
  }

  return (
    <SemanticProvider
      title="Restaurant Booking"
      description="Book a table at Nōri Omakase"
    >
      <SemanticHead />
      <SemanticBridge />

      <div className="app">
        <SemanticInfo
          role="restaurant"
          title="Nōri Omakase"
          meta={{
            cuisine: "Japanese Omakase",
            rating: 4.7,
            price: "$$$",
            address: "123 Main St, San Francisco",
          }}
        >
          <div className="card hero">
            <h1>Nōri Omakase</h1>
            <p className="subtitle">Japanese Omakase · $$$</p>
          </div>
        </SemanticInfo>

        <div className="card form">
          <h2>Book a Table</h2>

          <div className="field">
            <label>Party Size</label>
            <SemanticSelect
              name="party_size"
              label="Party Size"
              options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                value: n,
                label: `${n} ${n === 1 ? "guest" : "guests"}`,
              }))}
              value={size}
              onChange={(v) => setSize(v as number)}
            />
          </div>

          <div className="field">
            <label>Date</label>
            <SemanticDatePicker
              name="date"
              label="Date"
              value={date}
              onChange={setDate}
              min={today()}
              max={maxDate()}
            />
          </div>

          <div className="field">
            <label>Time</label>
            <SemanticSelect
              name="time"
              label="Time"
              options={[
                { value: "17:30", label: "5:30 PM" },
                { value: "18:00", label: "6:00 PM" },
                { value: "18:30", label: "6:30 PM" },
                { value: "19:00", label: "7:00 PM" },
                { value: "19:30", label: "7:30 PM" },
                { value: "20:00", label: "8:00 PM" },
                { value: "20:30", label: "8:30 PM" },
                { value: "21:00", label: "9:00 PM" },
              ]}
              value={time}
              onChange={setTime}
            />
          </div>

          <div className="field">
            <label>Name</label>
            <SemanticTextInput
              name="guest_name"
              label="Guest Name"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
          </div>

          <SemanticAction
            name="submit_booking"
            label="Book Table"
            onExecute={() => setBooked(true)}
            enabled={!!canSubmit}
            requires={["party_size", "date", "time", "guest_name"]}
            description="Submit the reservation"
          />
        </div>

        <DebugPanel />
      </div>
    </SemanticProvider>
  );
}

function DebugPanel() {
  const page = useSemanticPage();
  const [open, setOpen] = useState(false);

  return (
    <div className="card debug">
      <button className="debug-toggle" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} what AI sees
      </button>
      {open && <pre className="debug-output">{toPlainText(page)}</pre>}
    </div>
  );
}

export default App;
