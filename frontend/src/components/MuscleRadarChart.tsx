import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import "./muscleRadarChart.css";

interface MuscleData {
    muscle: string;
    value: number;
    fullMark: number;
}

interface MuscleRadarChartProps {
    data?: MuscleData[];
}

const defaultData: MuscleData[] = [
    { muscle: "Pecho", value: 65, fullMark: 100 },
    { muscle: "Espalda", value: 75, fullMark: 100 },
    { muscle: "Brazos", value: 55, fullMark: 100 },
    { muscle: "Piernas", value: 80, fullMark: 100 },
    { muscle: "Abdomen", value: 60, fullMark: 100 },
    { muscle: "Hombros", value: 70, fullMark: 100 },
];

export const MuscleRadarChart: React.FC<MuscleRadarChartProps> = ({
    data = defaultData,
}) => {
    return (
        <div className="muscle-radar-chart">
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={data}>
                    <PolarGrid
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                        dataKey="muscle"
                        tick={{ fill: "#fff", fontSize: 14 }}
                        className="muscle-radar-chart__label"
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        stroke="rgba(255, 255, 255, 0)"
                    />
                    <Radar
                        name="Desarrollo"
                        dataKey="value"
                        stroke="#dc2626"
                        fill="url(#muscleGradient)"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        formatter={(value: number) => [
                            `${value}%`,
                            "Desarrollo",
                        ]}
                    />
                    <defs>
                        <linearGradient
                            id="muscleGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="0%" stopColor="#dc2626" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
