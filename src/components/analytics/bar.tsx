import React from "react";
import { BarGroupHorizontal, Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisLeft } from "@visx/axis";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "d3-time-format";
import { ParentSize } from "@visx/responsive";
import { localPoint } from "@visx/event";

interface Data extends Record<string, string | number> {
  date: string;
}

type TooltipData = {
  key: string;
  value: number;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarGroupHorizontalProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  data: Data[];
};

const blue = "#aeeef8";
export const green = "#e5fd3d";
const purple = "#9caff6";
export const background = "#612efb";
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 50 };

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b");
const formatDate = (date: string) => format(parseDate(date) as Date);
function max<D>(arr: D[], fn: (d: D) => number) {
  return Math.max(...arr.map(fn));
}

let tooltipTimeout: number;

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

const HorizontalBar = ({
  width,
  height,
  margin = defaultMargin,
  events = false,
  data,
}: BarGroupHorizontalProps) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  });

  const keys = Object.keys(data[0] || {}).filter((d) => d !== "date");

  // accessors
  const getDate = (d: Data) => d.date;

  // scales
  const dateScale = scaleBand({
    domain: data.map(getDate),
    padding: 0.2,
  });
  const y1Scale = scaleBand({
    domain: keys,
    padding: 0.1,
  });
  const xScale = scaleLinear<number>({
    domain: [0, max(data, (d) => max(keys, (key) => Number(d[key])))],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [blue, green, purple],
  });

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  dateScale.rangeRound([0, yMax]);
  y1Scale.rangeRound([0, dateScale.bandwidth()]);
  xScale.rangeRound([0, xMax]);

  return width < 10 ? null : (
    <div className="relative">
      <svg width={width} height={height} ref={containerRef}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="currentColor"
          rx={14}
        />
        <Group top={margin.top} left={margin.left}>
          <BarGroupHorizontal
            data={data}
            keys={keys}
            width={xMax}
            y0={getDate}
            y0Scale={dateScale}
            y1Scale={y1Scale}
            xScale={xScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-horizontal-${barGroup.index}-${barGroup.y0}`}
                  top={barGroup.y0}
                >
                  {barGroup.bars.map((bar) => (
                    <Bar
                      key={`${barGroup.index}-${bar.index}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      rx={4}
                      onClick={() => {
                        if (events)
                          alert(
                            `${bar.key} (${bar.value}) - ${JSON.stringify(bar)}`
                          );
                      }}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={(event) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const eventSvgCoords = localPoint(event);
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: eventSvgCoords?.x,
                        });
                      }}
                    />
                  ))}
                </Group>
              ))
            }
          </BarGroupHorizontal>
          <AxisLeft
            scale={dateScale}
            stroke={green}
            tickStroke={green}
            tickFormat={formatDate}
            hideAxisLine
            tickLabelProps={() => ({
              fill: green,
              fontSize: 16,
              fontWeight: 800,
              textAnchor: "end",
              dy: "0.33em",
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div className="flex flex-col gap-2">
            <div style={{ color: colorScale("" + tooltipData.key) }}>
              <strong className="capitalize">{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.value} clicks</div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

interface ClicksBarProps {
  data: Data[];
}

export const ClicksBar: React.FC<ClicksBarProps> = (props) => {
  return (
    <div className="h-[320px] w-auto min-w-0">
      <ParentSize>
        {({ width, height }) => (
          <HorizontalBar data={props.data} width={width} height={height} />
        )}
      </ParentSize>
    </div>
  );
};
