import { ModulesCta } from "./modules-cta";
import { ModulesDeck } from "./modules-deck";
import { ModulesHero } from "./modules-hero";
import { RecordConsequences } from "./record-consequences";
import type {
  ModuleIndexItem,
  SerializableModuleIndexItem,
} from "@/lib/content/modules/modules-index";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * /modules, in four movements: the hero states the promise, the deck lets you
 * choose a starting point, the consequence stage proves the modules are one
 * system, and the close asks for the meeting.
 */
export function ModulesIndex({
  items,
}: {
  items?: readonly (SerializableModuleIndexItem | ModuleIndexItem)[];
}) {
  return (
    <div className={styles.modulesIndex__page}>
      <ModulesHero />
      <ModulesDeck items={items} />
      <RecordConsequences />
      <ModulesCta />
    </div>
  );
}
