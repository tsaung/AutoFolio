import { UniqueIdentifier } from "@dnd-kit/core";
import { TreeItem } from "./types";

export function getDepth(item: TreeItem) {
  return item.depth;
}

export function getMaxDepth({ previousItem }: { previousItem: TreeItem }) {
  if (previousItem) {
    return previousItem.depth + 1;
  }
  return 0;
}

export function getMinDepth({ nextItem }: { nextItem: TreeItem }) {
  if (nextItem) {
    return nextItem.depth;
  }
  return 0;
}
