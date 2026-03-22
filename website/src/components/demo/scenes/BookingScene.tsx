import { useState, useMemo } from "react";
import {
  SemanticTextInput,
  SemanticDatePicker,
  SemanticSelect,
  SemanticAction,
  SemanticList,
  SemanticInfo,
} from "@semant/react";
import { useAutoPlay } from "../useAutoPlay";

interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  distance: string;
}

const MOCK_HOTELS: Hotel[] = [
  { id: "h1", name: "Hotel Del Coronado", rating: 4.7, reviews: 2841, price: 289, distance: "0.2 mi from beach" },
  { id: "h2", name: "The Sofia Hotel", rating: 4.4, reviews: 1523, price: 179, distance: "Downtown" },
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: `${n} Guest${n > 1 ? "s" : ""}` }));
const ROOM_OPTIONS = [1, 2, 3, 4].map((n) => ({ value: n, label: `${n} Room${n > 1 ? "s" : ""}` }));

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getMaxDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export function BookingScene() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(1);
  const [searched, setSearched] = useState(false);
  const [booked, setBooked] = useState(false);

  const canSearch = destination && checkIn && checkOut;

  // Self-cycling animation
  const steps = useMemo(
    () => [
      { action: () => { setDestination(""); setCheckIn(null); setCheckOut(null); setGuests(2); setRooms(1); setSearched(false); setBooked(false); }, delay: 800 },
      { action: () => setDestination("San"), delay: 300 },
      { action: () => setDestination("San Di"), delay: 200 },
      { action: () => setDestination("San Diego"), delay: 200 },
      { action: () => setDestination("San Diego, CA"), delay: 800 },
      { action: () => setCheckIn("2026-04-15"), delay: 600 },
      { action: () => setCheckOut("2026-04-18"), delay: 600 },
      { action: () => setGuests(2), delay: 400 },
      { action: () => setRooms(1), delay: 600 },
      { action: () => { setSearched(true); setBooked(false); }, delay: 2000 },
      { action: () => setBooked(true), delay: 2500 },
    ],
    []
  );

  const { pause } = useAutoPlay(steps);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #bfc5cd",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "auto" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#333",
    marginBottom: 4,
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }} onClick={pause} onKeyDown={pause}>
      {/* Booking.com header */}
      <div
        style={{
          background: "var(--booking-blue)",
          padding: "16px 20px",
          borderRadius: "8px 8px 0 0",
          marginBottom: 0,
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Booking.com</span>
      </div>

      <SemanticInfo
        role="booking_platform"
        title="Hotel Search"
        meta={{ platform: "Booking.com", category: "hotels" }}
      >
        {/* Search Form */}
        <div
          style={{
            background: "var(--booking-yellow)",
            padding: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Destination</label>
            <SemanticTextInput
              name="destination"
              label="Destination"
              value={destination}
              onChange={setDestination}
              placeholder="Where are you going?"
            >
              {({ value, onChange }) => (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Where are you going?"
                  style={inputStyle}
                />
              )}
            </SemanticTextInput>
          </div>

          <div>
            <label style={labelStyle}>Check-in</label>
            <SemanticDatePicker
              name="check_in"
              label="Check-in Date"
              value={checkIn}
              onChange={setCheckIn}
              min={getToday()}
              max={getMaxDate()}
            >
              {({ value, select, min, max }) => (
                <input
                  type="date"
                  value={value ?? ""}
                  onChange={(e) => select(e.target.value || "")}
                  min={min}
                  max={max}
                  style={inputStyle}
                />
              )}
            </SemanticDatePicker>
          </div>

          <div>
            <label style={labelStyle}>Check-out</label>
            <SemanticDatePicker
              name="check_out"
              label="Check-out Date"
              value={checkOut}
              onChange={setCheckOut}
              min={checkIn ?? getToday()}
              max={getMaxDate()}
            >
              {({ value, select, min, max }) => (
                <input
                  type="date"
                  value={value ?? ""}
                  onChange={(e) => select(e.target.value || "")}
                  min={min}
                  max={max}
                  style={inputStyle}
                />
              )}
            </SemanticDatePicker>
          </div>

          <div>
            <label style={labelStyle}>Guests</label>
            <SemanticSelect
              name="guests"
              label="Guests"
              options={GUEST_OPTIONS}
              value={guests}
              onChange={(v) => setGuests(v as number)}
            >
              {({ options, selected, select }) => (
                <select
                  value={selected ?? ""}
                  onChange={(e) => select(Number(e.target.value))}
                  style={selectStyle}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            </SemanticSelect>
          </div>

          <div>
            <label style={labelStyle}>Rooms</label>
            <SemanticSelect
              name="rooms"
              label="Rooms"
              options={ROOM_OPTIONS}
              value={rooms}
              onChange={(v) => setRooms(v as number)}
            >
              {({ options, selected, select }) => (
                <select
                  value={selected ?? ""}
                  onChange={(e) => select(Number(e.target.value))}
                  style={selectStyle}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            </SemanticSelect>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <SemanticAction
              name="search_hotels"
              label="Search"
              onExecute={() => { setSearched(true); setBooked(false); }}
              enabled={!!canSearch}
              requires={["destination", "check_in", "check_out"]}
              description="Search for available hotels"
            >
              <button
                onClick={() => { setSearched(true); setBooked(false); }}
                disabled={!canSearch}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: canSearch ? "var(--booking-blue)" : "#8a9bb5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: canSearch ? "pointer" : "default",
                }}
              >
                Search
              </button>
            </SemanticAction>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div style={{ padding: 16, background: "#f5f5f5" }}>
            <SemanticList
              name="hotel_results"
              label="Hotel Results"
              items={MOCK_HOTELS}
              getLabel={(h) => h.name}
              getKey={(h) => h.id}
              getMeta={(h) => ({
                rating: h.rating,
                reviews: h.reviews,
                price: `$${h.price}/night`,
                distance: h.distance,
              })}
            >
              {({ items }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((hotel) => (
                    <div
                      key={hotel.id}
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 16,
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--booking-blue)" }}>
                          {hotel.name}
                        </div>
                        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                          {"★".repeat(Math.floor(hotel.rating))} {hotel.rating} ({hotel.reviews.toLocaleString()} reviews) &middot; {hotel.distance}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>${hotel.price}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>per night</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SemanticList>

            {!booked && (
              <div style={{ marginTop: 12 }}>
                <SemanticAction
                  name="book_hotel"
                  label="Book Hotel"
                  onExecute={() => setBooked(true)}
                  enabled={true}
                  requires={["hotel_results"]}
                  description="Book the selected hotel"
                >
                  <button
                    onClick={() => setBooked(true)}
                    style={{
                      padding: "10px 24px",
                      background: "var(--booking-blue)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Book Now
                  </button>
                </SemanticAction>
              </div>
            )}

            {booked && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#e6f9e6",
                  borderRadius: 8,
                  color: "#1a7a1a",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Booking confirmed!
              </div>
            )}
          </div>
        )}
      </SemanticInfo>

      {/* Agentic pitch */}
      <div
        style={{
          padding: "12px 16px",
          fontSize: 12,
          color: "var(--h-text-secondary)",
          fontFamily: "var(--font-mono)",
          textAlign: "center",
          background: "#fafafa",
          borderTop: "1px solid #eee",
        }}
      >
        # No vision model needed. Just: <span style={{ color: "var(--h-accent)" }}>set check_in 2026-04-15</span>
      </div>
    </div>
  );
}
