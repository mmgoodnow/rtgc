import { Button, Flex } from "@chakra-ui/react";
import type {
  OrphanedPath,
  ProblemTorrent,
  ProblemType,
} from "../../server/types";

interface TypeFilterProps {
  selectedType: ProblemType | "orphaned";
  problemTorrents: ProblemTorrent[];
  orphanedPaths: OrphanedPath[];
  onChange: (type: ProblemType | "orphaned") => void;
}

const DEFAULT_PROBLEM_TYPES: (ProblemType | "orphaned")[] = [
  "unregistered",
  "missingFiles",
  "timeout",
  "unknown",
  "healthy",
  "orphaned",
];

export function TypeFilter({
  selectedType,
  problemTorrents,
  orphanedPaths,
  onChange,
}: TypeFilterProps) {
  const counts: Record<string, number> = Object.fromEntries(
    Object.entries(Object.groupBy(problemTorrents, (p) => p.type)).map(
      ([type, torrents]) => [type, torrents?.length ?? 0]
    )
  );
  counts.orphaned = orphanedPaths.length;
  const problemTypes = Array.from(
    new Set([
      ...DEFAULT_PROBLEM_TYPES,
      ...problemTorrents.map((torrent) => torrent.type),
    ])
  );

  return (
    <Flex gap={2} align="center">
      {problemTypes.map((type) => (
        <Button
          key={type}
          value={type}
          variant={selectedType === type ? "solid" : "subtle"}
          onClick={() => onChange(type)}
        >
          {type} ({counts[type] ?? 0})
        </Button>
      ))}
    </Flex>
  );
}
