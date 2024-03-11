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

let C = ["#a8780d", "#a9770f", "#ab7611", "#ae7414", "#af7316", "#b27119", "#b3701b", "#b56f1d", "#b76d20", "#b96c22", "#bb6a25", "#bd6926", "#bf672a", "#c0662b", "#c1652d", "#c46230", "#c56132", "#c75f35", "#c85e37", "#ca5c3a", "#cb5a3c", "#cc593e", "#ce5741", "#cf5643", "#d05347", "#d15249", "#d2514b", "#d44e4f", "#d54d51", "#d64a55", "#d74957", "#d8465c", "#d9455e", "#d94361", "#db4066", "#db3f68", "#dc3c6d", "#dd3a70", "#dd3876", "#de3678", "#de357b", "#de3281", "#df3184", "#df2e8a", "#df2d8d", "#df2a93", "#de2997", "#de289a", "#de27a0", "#dd26a3", "#dc25a9", "#dc25ad", "#db25b0", "#da26b6", "#d926b9", "#d727be", "#d628c1", "#d42ac7", "#d32bc9", "#d22dcc", "#d02fd0", "#cf31d3", "#cc34d7", "#cb35d9", "#c839dd", "#c63adf", "#c53ce1", "#c23fe4", "#c041e5", "#bd45e8", "#bb46e9", "#b948eb", "#b64bed", "#b44dee", "#b050ef", "#ae52f0", "#aa55f1", "#a957f2", "#a759f3", "#a25cf3", "#a05df4", "#9c60f4", "#9a62f4", "#9565f4", "#9366f4", "#9168f4", "#8c6bf3", "#8a6cf3", "#856ff2", "#8270f1", "#7d73f0", "#7b74ef", "#7875ef", "#7378ed", "#7079ec", "#6b7be9", "#687ce8", "#667ee7", "#6080e4", "#5d81e3", "#5883df", "#5584de", "#4f86da", "#4d87d8", "#4a87d7", "#4589d3", "#428ad1", "#3d8bcd", "#3b8ccb", "#368dc7", "#348ec4", "#328ec2", "#2e8fbe", "#2c90bc", "#2891b8", "#2791b6", "#2591b4", "#2392b0", "#2192ae", "#1f93aa", "#1e93a8", "#1c94a4", "#1b94a2", "#1a94a0", "#19959c", "#18959a", "#169696", "#159694", "#149690", "#13978e", "#12978c", "#109788", "#0f9786", "#0d9882", "#0d9880", "#0c987c", "#0b9979", "#0b9977", "#0c9973", "#0d9970", "#0f9a6b", "#119a69", "#139a66", "#179a61", "#199a5e", "#1f9a58", "#219a55", "#279a4f", "#2b9a4c", "#2e9a49", "#359943", "#389940", "#409839", "#439836", "#4b972f", "#4f962c", "#539629", "#5a9423", "#5e9420", "#65921b", "#689119", "#6b9017", "#728f14", "#748e13", "#7a8c11", "#7d8b10", "#828a0f", "#84890e", "#86880e", "#8b860d", "#8d850d", "#91830d", "#93830d", "#97810d", "#99800d", "#9b7f0d", "#9f7d0d", "#a17c0d", "#a47a0d", "#a6790d"];

function getRayColor(i_deg) {
	if (i_deg > 180) {
		i_deg = 360 - i_deg;
	}
	return C[(i_deg + 90) % 180];
}

let TTs; // [[x, T, i_deg], ...]

function plotTTs() {
	let ttMax = Math.max.apply(null, TTs.map(xT => xT[1]));
	ttctx.scale(ttcanvas.width/xMax, -ttcanvas.height/ttMax);
	ttctx.translate(0, -ttMax);

	TTs.forEach(xT => {
		ttctx.strokeStyle = getRayColor(xT[2]);
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
		ctx.strokeStyle = getRayColor(i_deg);
		castRay(i_deg);
	}
	console.timeEnd("casting");

	// Plot TTs.
	plotTTs();
}

redraw();

window.onresize = redraw;
