import type { UniqueIdentifier } from "@dnd-kit/core";
import { SanityNavigationItem } from "@/types/sanity-types";

export interface TreeItem {
  id: UniqueIdentifier;
  children?: TreeItem[];
  collapsed?: boolean;
  depth: number;
  parentId: UniqueIdentifier | null;
  item: SanityNavigationItem;
}

export type FlattenedItem = TreeItem & {
  index: number;
};

export type SensorContext = {
  items: FlattenedItem[];
  offset: number;
};
