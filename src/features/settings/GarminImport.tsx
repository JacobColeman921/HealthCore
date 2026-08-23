import { useState, type ChangeEvent } from "react";
import { FileCsv, UploadSimple } from "@phosphor-icons/react";
import { Button } from "../../components/ui/Button";
import { useMettlefieldStore } from "../../store/useMettlefieldStore";
import { parseGarminExport } from "./garmin";

export function GarminImport() {
  const addCardioMany = useMettlefieldStore((state) => state.addCardioMany); const addSleepMany = useMettlefieldStore((state) => state.addSleepMany); const units = useMettlefieldStore((state) => state.profile.units); const [message, setMessage] = useState("");
  async function importFiles(event: ChangeEvent<HTMLInputElement>) { let activities = 0; let nights = 0; const warnings: string[] = []; for (const file of Array.from(event.target.files || [])) { const result = parseGarminExport(await file.text(), file.name, units); addCardioMany(result.cardio); addSleepMany(result.sleep); activities += result.cardio.length; nights += result.sleep.length; warnings.push(...result.warnings); } setMessage(warnings[0] || `Imported ${activities} activities and ${nights} sleep records.`); event.target.value = ""; }
  return <div className="garmin-import"><FileCsv aria-hidden="true" /><div><strong>Garmin export</strong><p>Import Activities CSV files or Garmin activity and sleep JSON exports. Files stay in this browser.</p>{message && <small role="status">{message}</small>}</div><label className="button secondary"><UploadSimple aria-hidden="true" /> Choose files<input className="sr-only" type="file" accept=".csv,.json,text/csv,application/json" multiple onChange={importFiles} /></label></div>;
}
