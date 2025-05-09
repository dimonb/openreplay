import React from 'react';
import { NoContent, Icon } from 'UI';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Styles } from '../../common';
import { useTranslation } from 'react-i18next';

interface Props {
  data: any;
  metric?: any;
}
function CPULoad(props: Props) {
  const { data, metric } = props;
  const gradientDef = Styles.gradientDef();
  const { t } = useTranslation();

  return (
    <NoContent
      size="small"
      title={
        <div className="flex items-center">
          <Icon name="info-circle" className="mr-2" size="14" />
          {t('No data available for the selected period.')}
        </div>
      }
      show={metric.data.chart && metric.data.chart.length === 0}
      style={{ height: '240px' }}
    >
      <ResponsiveContainer height={240} width="100%">
        <AreaChart data={metric.data.chart} margin={Styles.chartMargins}>
          {gradientDef}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#EEEEEE"
          />
          <XAxis
            {...Styles.xaxis}
            dataKey="time"
            interval={metric.params.density / 7}
          />
          <YAxis
            {...Styles.yaxis}
            allowDecimals={false}
            tickFormatter={(val) => Styles.tickFormatter(val)}
            label={{ ...Styles.axisLabelLeft, value: 'CPU Load (%)' }}
          />
          <Tooltip {...Styles.tooltip} />
          <Area
            name="Avg"
            type="monotone"
            unit="%"
            dataKey="value"
            stroke={Styles.strokeColor}
            fillOpacity={1}
            strokeWidth={2}
            strokeOpacity={0.8}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </NoContent>
  );
}

export default CPULoad;
