
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SentimentData = {
  type: string;
  value: number;
  color: string;
};

type SentimentChartProps = {
  data: SentimentData[];
};

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>Voter Sentiment</CardTitle>
        <CardDescription>
          Sentiment breakdown based on message analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} Voters`, 'Count']}
              itemStyle={{ color: '#000' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
