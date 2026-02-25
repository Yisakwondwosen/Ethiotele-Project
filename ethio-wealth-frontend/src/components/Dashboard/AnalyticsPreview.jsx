import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

export default function AnalyticsPreview({ chartView, setChartView, trendData, breakdownData, t }) {
    // Determine the view type
    const isTrend = chartView === 'trend';

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-xl font-bold font-sans text-white uppercase tracking-wide">
                    {t ? t('analytics') : 'Analytics'}
                </h2>
                {/* Toggle View */}
                <div className="bg-[#121212] border border-[#222] p-1 rounded-[8px] flex text-xs font-mono font-bold">
                    <button
                        onClick={() => setChartView('trend')}
                        className={`px-4 py-2 rounded-[6px] transition uppercase tracking-wider ${isTrend ? 'bg-white text-black' : 'text-[#A1A1AA] hover:text-white'}`}
                    >
                        Trend
                    </button>
                    <button
                        onClick={() => setChartView('breakdown')}
                        className={`px-4 py-2 rounded-[6px] transition uppercase tracking-wider ${!isTrend ? 'bg-white text-black' : 'text-[#A1A1AA] hover:text-white'}`}
                    >
                        Breakdown
                    </button>
                </div>
            </div>

            {/* Chart Container Container #121212 */}
            <div className="h-64 w-full bg-[#121212] p-6 rounded-[16px] border border-[#222] overflow-hidden">
                {isTrend ? (
                    <Bar
                        data={trendData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    grid: { display: false, color: '#333' },
                                    ticks: { color: '#A1A1AA', font: { family: '"Fira Code", monospace' } }
                                },
                                y: {
                                    display: false,
                                    grid: { display: false },
                                }
                            },
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#000',
                                    titleColor: '#FFF',
                                    bodyColor: '#A1A1AA',
                                    borderColor: '#222',
                                    borderWidth: 1,
                                    titleFont: { family: '"Fira Code", monospace' },
                                    bodyFont: { family: '"Fira Code", monospace' }
                                }
                            }
                        }}
                    />
                ) : (
                    <div className="relative h-full flex items-center justify-center">
                        <Doughnut
                            data={breakdownData}
                            options={{
                                maintainAspectRatio: false,
                                cutout: '75%',
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            usePointStyle: true,
                                            boxWidth: 8,
                                            color: '#A1A1AA',
                                            font: { family: '"Fira Code", monospace', size: 12 }
                                        }
                                    },
                                    tooltip: {
                                        backgroundColor: '#000',
                                        titleColor: '#FFF',
                                        bodyColor: '#A1A1AA',
                                        borderColor: '#222',
                                        borderWidth: 1,
                                        bodyFont: { family: '"Fira Code", monospace' }
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
