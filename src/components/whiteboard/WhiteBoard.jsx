import { createClient } from "@supabase/supabase-js";
import { useSyncDemo } from "@tldraw/sync";
import React from "react";
import { Tldraw, getSnapshot, loadSnapshot, useEditor } from "tldraw";
import "tldraw/tldraw.css";

// Supabase client initialization
const SUPABASE_URL = "https://bkjveojapfctlmhriglq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJranZlb2phcGZjdGxtaHJpZ2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDE3MTAsImV4cCI6MjA1ODkxNzcxMH0.7INxr_UppPwnHbSDaJ8f8onQwyjPCua10NHONwP-D6w";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchData(persistenceKey) {
  try {
    const { data, error } = await supabase
      .from("whiteboards")
      .select("*")
      .eq("key", persistenceKey);

    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching data:", err);
    return null;
  }
}

async function saveOrUpdateData(persistenceKey, json) {
  try {
    const existingData = await fetchData(persistenceKey);

    if (existingData && existingData.length > 0) {
      const { data, error } = await supabase
        .from("whiteboards")
        .update({ json })
        .eq("key", persistenceKey)
        .select();

      if (error) {
        console.error("Error updating data:", error);
      } else {
        console.log("Data updated:", data);
      }
    } else {
      const { data, error } = await supabase
        .from("whiteboards")
        .insert([{ key: persistenceKey, json }])
        .select();

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log("Data inserted:", data);
      }
    }
  } catch (err) {
    console.error("Unexpected error saving data:", err);
  }
}

function Toolbar({ persistenceKey }) {
  const editor = useEditor();

  const handleSave = async () => {
    const snapshot = getSnapshot(editor.store);
    const { document, session } = snapshot;
    const json = JSON.stringify({ document, session });

    await saveOrUpdateData(persistenceKey, json);
  };

  const handleLog = async () => {
    const data = await fetchData(persistenceKey);
    console.log("Fetched data:", data);
  };

  return (
    <div style={{ pointerEvents: "all" }}>
      <button onClick={handleLog}>Log</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

async function loadData(editor, persistenceKey) {
  try {
    const data = await fetchData(persistenceKey);

    if (!data || !data[0]?.json) {
      console.error("No valid data found:", data);
      return;
    }

    const json = JSON.parse(data[0].json);
    loadSnapshot(editor.store, json);
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

function WhiteBoard({ persistenceKey, isRT = false }) {
  const store = useSyncDemo({ roomId: persistenceKey });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        persistenceKey={persistenceKey || null}
        onMount={(editor) => loadData(editor, persistenceKey)}
        store={isRT ? store : null}
        components={{
          SharePanel: () => <Toolbar persistenceKey={persistenceKey} />,
        }}
      />
    </div>
  );
}

export default WhiteBoard;