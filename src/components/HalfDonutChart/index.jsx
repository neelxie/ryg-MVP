import React from "react";
import { Pie, PieChart } from "recharts";

export default class PieDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: "Red", value: props.data.red, fill: "red" },
        { name: "Green", value: props.data.green, fill: "green" },
        { name: "Yellow", value: props.data.yellow, fill: "yellow" },
      ],
    };
  }

  render() {
    return (
      <PieChart width={400} height={300} style={{ margin: "0 auto" }}>
        <Pie
          activeIndex={[0]}
          data={this.state.data}
          dataKey="value"
          innerRadius={30}
          outerRadius={80}
          label={true}
          nameKey="Selection"
          // key={this.state.data}
          isAnimationActive={false}
          fill="#ffa700"
        />
      </PieChart>
    );
  }
}
