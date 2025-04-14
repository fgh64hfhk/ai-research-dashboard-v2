"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";

import {
  fetchModelVersions,
  useVersionLoading,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";
import { useVersionContext } from "@/contexts/version/VersionContext";
import { VersionList } from "@/components/models/VersionList";

interface Props {
  modelId: string;
}

export function ModelVersionAccordion({ modelId }: Props) {
  const versions = useVersionsByModelId(modelId);
  const isLoading = useVersionLoading(modelId);

  const [toFetch, setFetchState] = useState(true);

  const { dispatch } = useVersionContext();

  return (
    <Accordion type="single" collapsible className="w-full mt-2">
      <AccordionItem value="versions">
        <AccordionTrigger
          className="text-sm"
          onClick={() => {
            if (toFetch) {
              fetchModelVersions(modelId, dispatch);
              setFetchState(false);
            }
          }}
        >
          查看所有版本
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <VersionList
            modelId={modelId}
            versions={versions}
            isLoading={isLoading}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
