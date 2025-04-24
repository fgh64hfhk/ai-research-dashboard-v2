import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ParameterItem {
  key: string;
  baseValue: string | number | boolean;
  targetValue: string | number | boolean;
}

interface ParameterCompareCardProps {
  baseVersionId: string;
  targetVersionId: string;
  parameters?: ParameterItem[];
}

const ParameterCompareCard: React.FC<ParameterCompareCardProps> = ({
  baseVersionId,
  targetVersionId,
  parameters = [
    { key: "learning_rate", baseValue: 0.01, targetValue: 0.02 },
    { key: "batch_size", baseValue: 32, targetValue: 32 },
    { key: "epochs", baseValue: 10, targetValue: 20 },
  ],
}) => {
  const getDiffBadge = (a: string | number | boolean, b: string | number | boolean) => {
    return a !== b ? <Badge variant="destructive">變更</Badge> : null;
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="text-lg font-semibold">參數差異比較</div>
        {parameters.length === 0 ? (
          <p className="text-muted-foreground text-sm">目前無參數差異資訊。</p>
        ) : (
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th>參數名稱</th>
                <th>{baseVersionId}</th>
                <th>{targetVersionId}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((item) => (
                <tr key={item.key}>
                  <td className="font-medium">{item.key}</td>
                  <td>{String(item.baseValue)}</td>
                  <td>{String(item.targetValue)}</td>
                  <td>{getDiffBadge(item.baseValue, item.targetValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterCompareCard;
