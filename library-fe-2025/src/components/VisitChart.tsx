import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

// Dữ liệu giả lập lượt truy cập
const mockData = [
    { timestamp: "08:00", value: 120 },
    { timestamp: "09:00", value: 250 },
    { timestamp: "10:00", value: 300 },
    { timestamp: "11:00", value: 280 },
    { timestamp: "12:00", value: 150 },
    { timestamp: "13:00", value: 180 },
    { timestamp: "14:00", value: 320 },
    { timestamp: "15:00", value: 400 },
    { timestamp: "16:00", value: 350 },
    { timestamp: "17:00", value: 200 },
];

const VisitChart = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Website Visits (Today)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="timestamp" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#9333ea"
                            strokeWidth={3}
                            activeDot={{ r: 6, fill: '#7e22ce' }}
                            dot={{fill: '#9333ea'}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VisitChart;