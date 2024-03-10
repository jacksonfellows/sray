let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");

let vcanvas = document.getElementById("vc");
let vctx = vcanvas.getContext("2d");

let ttcanvas = document.getElementById("ttc");
let ttctx = ttcanvas.getContext("2d");

let xMax = 150;
let zMax = 70;

let vMax = 12;

function inBounds(x, z) {
	return 0 <= x && x < xMax && 0 <= z && z < zMax;
}

let [startX, startZ] = [5, 5];

canvas.onclick = e => {
	startX = e.offsetX*xMax/canvas.width;
	startZ = e.offsetY*zMax/canvas.height;
	redraw();
};

let VM_dz = 5;

let VM = [[0, 6], [5, 6.1], [10, 6.2], [15, 6.3], [20, 6.4], [25, 6.5], [30, 8.0], [35, 8.03], [40, 8.05], [45, 8.07], [50, 8.1], [55, 8.12], [60, 8.14], [65, 8.16], [70, 8.18], [75, 8.2], [80, 8.22], [85, 8.24], [90, 8.26], [95, 8.28], [100, 8.3]];

vcanvas.onclick = e => {
	let z = e.offsetY*zMax/vcanvas.height;
	let v = e.offsetX*vMax/vcanvas.width;
	let i = Math.round(z/VM_dz);
	VM[i][1] = v;
	redraw();
};

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

let TTs; // [[x, T, i_deg], ...]

function plotTTs() {
	let ttMax = Math.max.apply(null, TTs.map(xT => xT[1]));
	ttctx.scale(ttcanvas.width/xMax, -ttcanvas.height/ttMax);
	ttctx.translate(0, -ttMax);

	TTs.sort((a, b) => a[0] - b[0]);

	TTs.forEach(xT => {
		ttctx.strokeStyle = `hsl(${xT[2]*4}, 100%, 50%)`;
		ttctx.beginPath();
		ttctx.lineTo(xT[0] - 0.3, xT[1]);
		ttctx.lineTo(xT[0] + 0.3, xT[1]);
		ttctx.save();
		ttctx.resetTransform();
		ttctx.lineWidth = 1;
		ttctx.stroke();
		ttctx.restore();
	});
}

function castRay(i_deg) {
	let [x, z] = [startX, startZ];
	let i = i_deg*Math.PI/180;
	let p = Math.sin(i)/v(z);

	ctx.beginPath();

	ctx.lineTo(x, z);

	let dz = 0.01;

	if (90 <= i_deg && i_deg <= 270) {
		dz = -dz;				// Start going up.
	}

	let T = 0;

	let N = 100000;
	for (let n = 0; n < N; n++) {
		z += dz;
		let v_z = v(z);
		let eta = Math.sqrt(1/(v_z*v_z) - p*p);
		if (isNaN(eta) || eta < 1e-3) {
			if (dz < 0 && z < 1e-3) break;
			dz = -dz;
			continue;
		}
		T += 1/(v_z*v_z*eta)*Math.abs(dz);
		x += p/eta*Math.abs(dz);
		if (inBounds(x, z)) {
			ctx.lineTo(x, z);
		}
		else {
			break;
		}
	}

	if (Math.abs(z) < 1) {
		TTs.push([x, T, i_deg]);
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
	let ttHeight = 150;
	canvas.width = 0.8*window.innerWidth;
	vcanvas.width = window.innerWidth - canvas.width - padding;
	canvas.height = window.innerHeight - padding - ttHeight;
	vcanvas.height = canvas.height;

	ttcanvas.width = canvas.width;
	ttcanvas.height = ttHeight;

	// Re-scale canvases.
	ctx.scale(canvas.width/xMax, canvas.height/zMax);
	vctx.scale(vcanvas.width/vMax, vcanvas.height/zMax);

	// Draw VM.
	plotVM();

	// Cast rays.
	TTs = [];
	console.time("casting");
	for (let i_deg = 0; i_deg < 360; i_deg += 1) {
		ctx.strokeStyle = `hsl(${i_deg*4}, 100%, 50%)`;
		castRay(i_deg);
	}
	console.timeEnd("casting");

	// Plot TTs.
	plotTTs();
}

redraw();

window.onresize = redraw;
