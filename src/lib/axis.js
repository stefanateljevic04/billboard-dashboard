import { axisBottom, axisLeft, select } from 'd3';

// D3 owns only the children of these dedicated axis groups.
export function axis(node, options) {
	function draw({ scale, orientation = 'bottom', ticks = 5, format, values }) {
		const generator = (orientation === 'left' ? axisLeft : axisBottom)(scale)
			.ticks(ticks)
			.tickSizeOuter(0);
		if (format) generator.tickFormat(format);
		if (values) generator.tickValues(values);
		select(node).call(generator);
	}
	draw(options);
	return { update: draw };
}
