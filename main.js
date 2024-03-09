let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");

let vcanvas = document.getElementById("vc");
let vctx = vcanvas.getContext("2d");

xMax = 150;
zMax = 70;

vMax = 12;

function inBounds(x, z) {
	return 0 <= x && x < xMax && 0 <= z && z < zMax;
}

VM = [[0, 5], [10, 5.5], [25, 7.5], [100, 10]];

function plotVM() {
	vctx.beginPath();
	VM.forEach(zv => {
		vctx.lineTo(zv[1], zv[0]);
	});
	vctx.save();
	vctx.resetTransform();
	vctx.lineWidth = 1;
	vctx.stroke();
	vctx.restore();
}

function v(z) {
	let [z0, v0] = VM[0];
	for (let i = 1; i < VM.length; i++) {
		let [z1, v1] = VM[i];
		if (z0 <= z && z < z1) {
			return v0 + (z - z0)*(v1 - v0)/(z1 - z0);
		}
		z0 = z1; v0 = v1;
	}
	return v0;
};

function castRay(i_deg) {
	let [x, z] = [5, 5];
	let i = i_deg*Math.PI/180;
	let p = Math.sin(i)/v(z);

	ctx.beginPath();

	ctx.lineTo(x, z);

	let dz = 0.01;

	if (90 <= i_deg && i_deg <= 270) {
		dz = -dz;				// Start going up.
	}

	while (1) {
		z += dz;
		let v_z = v(z);
		let eta = Math.sqrt(1/(v_z*v_z) - p*p);
		if (isNaN(eta) || eta < 1e-3) {
			if (dz < 0 && z < 1) break;
			dz = -dz;
			continue;
		}
		x += p/eta*Math.abs(dz);
		if (inBounds(x, z)) {
			ctx.lineTo(x, z);
		}
		else {
			break;
		}
	}

	// Make line width independent of any transformations.
	ctx.save();
	ctx.resetTransform();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.restore();
}

function redraw() {
	// Set canvas sizes to match window.
	let padding = 10;
	canvas.width = 0.8*window.innerWidth;
	vcanvas.width = window.innerWidth - canvas.width - padding;
	canvas.height = window.innerHeight - padding;
	vcanvas.height = canvas.height;

	// Re-scale canvases.
	ctx.scale(canvas.width/xMax, canvas.height/zMax);
	vctx.scale(vcanvas.width/vMax, vcanvas.height/zMax);


	// Draw VM.
	plotVM();

	// Cast rays.
	console.time("casting");
	for (let i_deg = 0; i_deg < 360; i_deg += 2) {
		ctx.strokeStyle = `hsl(${i_deg*4}, 100%, 50%)`;
		castRay(i_deg);
	}
	console.timeEnd("casting");
}

redraw();

window.onresize = redraw;
