import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Model } from "@/types/model";
import { ModelDescription } from "@/components/model/ModelDescription";

export function ModelHeader({ name, language, description }: Model) {
  return (
    <Card>
      <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {name}
          </h1>
          <p className="text-sm text-muted-foreground">編程語言：{language}</p>
        </div>
        <ModelDescription description={description} />
      </CardContent>
    </Card>
  );
}
