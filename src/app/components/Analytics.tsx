"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@app/components/ui/chart"
import { useEffect, useState } from "react"
import { mainBoards } from "@lib/const"
import { _getBoards, _getTasks } from "@lib/server_actions/database_crud"
const defaultChartData = [
    { date: "2024-01-01", new: 186, completed: 180 },
    { date: "2024-01-02", new: 186, completed: 180 },
    { date: "2024-01-03", new: 186, completed: 180 },
    { date: "2024-01-04", new: 305, completed: 200 },
    { date: "2024-01-05", new: 305, completed: 200 },
  ]

const chartConfig = {
    new: {
        label: "New task",
        color: "hsl(var(--chart-1))",
      },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
 
} satisfies ChartConfig


const tickMargin = 10; // Custom margin for xAxis ticks
const barGap = `${-100 + (tickMargin * 2)}%`; // Calculating barGap

export function Analytics({showTitle = true}:{showTitle?:boolean}) {
    const [chartData, setChartData] = useState<typeof defaultChartData | null>(null)


    useEffect(()=>{
        const mainBoardsids = mainBoards.map(b => b.id)

        _getBoards(mainBoardsids)
        .then(res => {

            if(res.success){

                let newChartData = []

                res.boards.forEach(b => {
                b.BoardStatus?.forEach(s => {
                    s?.tasks.forEach(task => {

                    if (task.isCompleted) {
                        let date = task.updatedAt.toLocaleDateString()
                        const index = newChartData.findIndex(i => i.date == date)

                        if(index != -1){
                            newChartData[index].completed = newChartData[index].completed + 1

                        } else {
                            let chartDataFormat = {
                                date: date,
                                new: 0,
                                completed:
                                1
                            }
                            completedTask.push(chartDataFormat);
                        }
                       

                        
                    } else {
                        let date = task.createdAt.toLocaleDateString()
                        const index = newChartData.findIndex(i => i.date == date)

                        if(index != -1){
                            newChartData[index].new = newChartData[index].new + 1

                        } else {

                            let chartDataFormat = {
                                date: date,
                                new: 1,
                                completed:
                                0
                            }
                            newChartData.push(chartDataFormat);
                        }
                    }

                    setChartData(newChartData)
                    });
                });
                });
            }


        })
        .catch(err => {
            console.error(err)
        })

    },[])



  return (
    <Card>
     {showTitle && <CardHeader>
        <CardTitle>Analytics</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={tickMargin}
              axisLine={false}
            //   tickFormatter={(value) => value.slice(0, 3)}

            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="new"
              
              fill="var(--color-new)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              
              
              fill="var(--color-completed)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
