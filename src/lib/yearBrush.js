import { brushX, select } from 'd3';

function sameRange(a, b) {
	return a === b || (a !== null && b !== null && a[0] === b[0] && a[1] === b[1]);
}

// D3 owns only the children of the dedicated brush group.
export function yearBrush(node, initialOptions) {
	const group = select(node);
	let options;
	let currentRange = null;
	let selectionDomain = null;
	const brush = brushX().on('brush.yearFilter end.yearFilter', (event) => {
		// Resizing or clearing via props must not feed back into page state.
		if (!event.sourceEvent) return;
		selectionDomain = event.selection?.map(options.scale.invert) ?? null;
		const range = selectionDomain?.map(Math.round) ?? null;
		if (!sameRange(range, currentRange)) {
			currentRange = range;
			options.onChange(range);
		}
	});

	function update(nextOptions) {
		const scaleChanged = options?.scale !== nextOptions.scale;
		const rangeChanged = !sameRange(currentRange, nextOptions.range);
		options = nextOptions;
		if (rangeChanged) {
			currentRange = options.range;
			selectionDomain = options.range;
		}
		group.call(brush.extent(options.extent));
		if (scaleChanged || rangeChanged) {
			group.call(brush.move, selectionDomain?.map(options.scale) ?? null);
		}
	}

	update(initialOptions);
	return {
		update,
		destroy() {
			group.on('.brush', null);
			brush.on('.yearFilter', null);
		}
	};
}
