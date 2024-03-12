let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");

let vcanvas = document.getElementById("vc");
let vctx = vcanvas.getContext("2d");

// let ttcanvas = document.getElementById("ttc");
// let ttctx = ttcanvas.getContext("2d");

let vMax = 15;

let R = 6371;

canvas.onclick = e => {
	let p = ctx.getTransform().inverse().transformPoint({x: e.offsetX, y: e.offsetY});
	startR = Math.min(Math.sqrt(p.x*p.x + p.y*p.y), R);
	startTheta = Math.atan2(p.y, p.x);
	// console.log(p.x, p.y, startR, startTheta);
	redraw();
};

// vcanvas.onclick = e => {
//	let z = e.offsetY*zMax/vcanvas.height;
//	let v = e.offsetX*vMax/vcanvas.width;
//	let i = Math.round(z/VM_dz);
//	VM[i][1] = v;
//	redraw();
// };

function plotVM() {
	vctx.beginPath();
	VM.forEach(rv => {
		vctx.lineTo(rv[1], rv[0]);
	});
	vctx.save();
	vctx.resetTransform();
	vctx.lineWidth = 1;
	vctx.stroke();
	vctx.restore();
}

// VM loaded from vm.js.

function interpVM(dr) {
	let interp = [];
	let i = 0;
	for (let r = 0; r < R; r += dr) {
		while (r >= VM[i][0]) {
			i++;
		}
		let [r0, v0] = VM[i - 1];
		let [r1, v1] = VM[i];
		interp.push([r, v0 + (r - r0)*(v1 - v0)/(r1 - r0)]);
	}
	interp.push(VM[VM.length - 1]);
	return interp;
}

let VMInterp = interpVM(1);

function v(r) {
	if (r > R) return VMInterp[R][1];
	let i = Math.floor(r);
	if (r == i) return VMInterp[i][1];
	let [r0, v0] = VMInterp[i];
	let [r1, v1] = VMInterp[i + 1];
	return v0 + (r - r0)*(v1 - v0)/(r1 - r0);
};

let C = ["#a8780d", "#a8780d", "#a9770f", "#ab7611", "#ab7611", "#ac7513", "#ae7414", "#ae7414", "#af7316", "#b17218", "#b27119", "#b27119", "#b3701b", "#b56f1d", "#b56f1d", "#b66e1e", "#b76d20", "#b96c22", "#b96c22", "#ba6b23", "#bb6a25", "#bb6a25", "#bd6926", "#be6828", "#bf672a", "#bf672a", "#c0662b", "#c1652d", "#c1652d", "#c2642e", "#c46230", "#c56132", "#c56132", "#c66033", "#c75f35", "#c75f35", "#c85e37", "#c95d38", "#ca5c3a", "#ca5c3a", "#cb5a3c", "#cc593e", "#cc593e", "#cd583f", "#ce5741", "#cf5643", "#cf5643", "#d05445", "#d05347", "#d05347", "#d15249", "#d2514b", "#d2514b", "#d34f4d", "#d44e4f", "#d54d51", "#d54d51", "#d54b53", "#d64a55", "#d64a55", "#d74957", "#d8475a", "#d8465c", "#d8465c", "#d9455e", "#d94361", "#d94361", "#da4263", "#db4066", "#db3f68", "#db3f68", "#dc3d6b", "#dc3c6d", "#dc3c6d", "#dd3a70", "#dd3973", "#dd3876", "#dd3876", "#de3678", "#de357b", "#de357b", "#de337e", "#de3281", "#df3184", "#df3184", "#df2f87", "#df2e8a", "#df2e8a", "#df2d8d", "#df2b90", "#df2a93", "#df2a93", "#de2997", "#de289a", "#de289a", "#de289d", "#de27a0", "#de27a0", "#dd26a3", "#dd26a6", "#dc25a9", "#dc25a9", "#dc25ad", "#db25b0", "#db25b0", "#da25b3", "#da26b6", "#d926b9", "#d926b9", "#d827bc", "#d727be", "#d727be", "#d628c1", "#d529c4", "#d42ac7", "#d42ac7", "#d32bc9", "#d22dcc", "#d22dcc", "#d12ece", "#d02fd0", "#cf31d3", "#cf31d3", "#cd32d5", "#cc34d7", "#cc34d7", "#cb35d9", "#c937db", "#c839dd", "#c839dd", "#c63adf", "#c53ce1", "#c53ce1", "#c33ee2", "#c23fe4", "#c041e5", "#c041e5", "#be43e7", "#bd45e8", "#bd45e8", "#bb46e9", "#b948eb", "#b948eb", "#b84aec", "#b64bed", "#b44dee", "#b44dee", "#b24fef", "#b050ef", "#b050ef", "#ae52f0", "#ac54f1", "#aa55f1", "#aa55f1", "#a957f2", "#a759f3", "#a759f3", "#a45af3", "#a25cf3", "#a05df4", "#a05df4", "#9e5ff4", "#9c60f4", "#9c60f4", "#9a62f4", "#9863f4", "#9565f4", "#9565f4", "#9366f4", "#9168f4", "#9168f4", "#8f69f4", "#8c6bf3", "#8a6cf3", "#8a6cf3", "#876df3", "#856ff2", "#856ff2", "#8270f1", "#8071f1", "#7d73f0", "#7d73f0", "#7b74ef", "#7875ef", "#7875ef", "#7677ee", "#7378ed", "#7378ed", "#7079ec", "#6e7aeb", "#6b7be9", "#6b7be9", "#687ce8", "#667ee7", "#667ee7", "#637fe6", "#6080e4", "#5d81e3", "#5d81e3", "#5a82e1", "#5883df", "#5883df", "#5584de", "#5285dc", "#4f86da", "#4f86da", "#4d87d8", "#4a87d7", "#4a87d7", "#4788d5", "#4589d3", "#428ad1", "#428ad1", "#408acf", "#3d8bcd", "#3d8bcd", "#3b8ccb", "#388cc9", "#368dc7", "#368dc7", "#348ec4", "#328ec2", "#328ec2", "#308fc0", "#2e8fbe", "#2c90bc", "#2c90bc", "#2a90ba", "#2891b8", "#2891b8", "#2791b6", "#2591b4", "#2591b4", "#2492b2", "#2392b0", "#2192ae", "#2192ae", "#2093ac", "#1f93aa", "#1f93aa", "#1e93a8", "#1d94a6", "#1c94a4", "#1c94a4", "#1b94a2", "#1a94a0", "#1a94a0", "#19959e", "#19959c", "#18959a", "#18959a", "#179598", "#169696", "#169696", "#159694", "#149692", "#149690", "#149690", "#13978e", "#12978c", "#12978c", "#11978a", "#109788", "#0f9786", "#0f9786", "#0e9884", "#0d9882", "#0d9882", "#0d9880", "#0c987e", "#0c987c", "#0c987c", "#0b9979", "#0b9977", "#0b9977", "#0b9975", "#0c9973", "#0c9973", "#0d9970", "#0e996e", "#0f9a6b", "#0f9a6b", "#119a69", "#139a66", "#139a66", "#159a63", "#179a61", "#199a5e", "#199a5e", "#1c9a5b", "#1f9a58", "#1f9a58", "#219a55", "#249a52", "#279a4f", "#279a4f", "#2b9a4c", "#2e9a49", "#2e9a49", "#319946", "#359943", "#389940", "#389940", "#3c993c", "#409839", "#409839", "#439836", "#479732", "#4b972f", "#4b972f", "#4f962c", "#539629", "#539629", "#569526", "#5a9423", "#5e9420", "#5e9420", "#61931e", "#65921b", "#65921b", "#689119", "#6b9017", "#6b9017", "#6f9016", "#728f14", "#748e13", "#748e13", "#778d12", "#7a8c11", "#7a8c11", "#7d8b10", "#7f8b0f", "#828a0f", "#828a0f", "#84890e", "#86880e", "#86880e", "#88870e", "#8b860d", "#8d850d", "#8d850d", "#8f840d", "#91830d", "#91830d", "#93830d", "#95820d", "#97810d", "#97810d", "#99800d", "#9b7f0d", "#9b7f0d", "#9d7e0d", "#9f7d0d", "#a17c0d", "#a17c0d", "#a27b0d", "#a47a0d", "#a47a0d", "#a6790d", "#a8780d"];

function getRayColor(i_deg) {
	if (i_deg < 0) {
		i_deg = 361 + i_deg;
	}
	return C[(i_deg + 180) % 360];
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

function lineToPolar(r, theta) {
	let x = r*Math.cos(theta);
	let y = r*Math.sin(theta);
	ctx.lineTo(x, y);
}


let startR = R - 600;
let startTheta = 150*Math.PI/180;

function castRay(i_deg) {
	let [r, theta] = [startR, startTheta];
	let i = i_deg*Math.PI/180;
	let p = r*Math.sin(i)/v(r);

	ctx.beginPath();

	lineToPolar(r, theta);

	let T = 0;

	let dr = -1;

	if (Math.abs(i_deg) > 90) {
		dr = -dr;
	}

	let N = 10*7000;
	for (let n = 0; n < N; n++) {
		// console.log("r=", r, "theta=", theta);

		if (r > R) {
			// console.log(r);
			// console.log("hit surface");
			break;
		}

		if (r <= Math.abs(dr)) {
			// console.log(r);
			r = Math.abs(dr)+0.1;
			dr = -dr;
			theta = theta + Math.PI;
			continue;
		}

		let k1 = p/(r*Math.sqrt(Math.pow(r/v(r), 2) - p*p));
		let r2 = r + dr/2;
		let k2 = p/(r2*Math.sqrt(Math.pow(r2/v(r2), 2) - p*p));
		let r3 = r + dr;
		let k3 = p/(r3*Math.sqrt(Math.pow(r3/v(r3), 2) - p*p));

		if (isNaN(k1) || isNaN(k2) || isNaN(k3)) {
			// console.log("bottomed");
			// console.log(k1, k2, k3);
			// console.log(r3);
			// console.log(Math.pow(r/v(r), 2) - p*p);
			// console.log(Math.pow(r2/v(r2), 2) - p*p);
			// console.log(Math.pow(r3/v(r3), 2) - p*p);
			// if (dr > 0 && Math.abs(R - r) < dr) {
			//	break;
			// }
			dr = -dr;
			// console.log(r);
			continue;
			// break;
		}

		// Simpson's rule.
		theta += Math.abs(dr)/6*(k1 + 4*k2 + k3);
		r += dr;

		// let dtheta_dr = p/d;
		// let dT_dr = xi*xi/d;
		// theta += dtheta_dr*Math.abs(dr);
		// T += dT_dr*Math.abs(dr);


		lineToPolar(r, theta);
	}

	// console.log(startR, r, startTheta, theta, T);

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
	canvas.height = window.innerHeight - padding;
	canvas.width = canvas.height;
	vcanvas.height = canvas.height;
	vcanvas.width = 200;

	// Re-scale canvases.
	let canvasSize = 2*(R + 100);
	let scale = canvas.height/canvasSize;
	ctx.scale(scale, -scale);
	ctx.translate(R + 100, -(R + 100));

	vctx.scale(vcanvas.width/vMax, -scale);
	vctx.translate(0, -(R + 100));

	for (let r of [1217.1, 3482, R]) {
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, 2*Math.PI);
		ctx.save();
		ctx.resetTransform();
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.restore();
	}

	// Draw VM.
	plotVM();

	// Cast rays.
	// TTs = [];
	console.time("casting");
	// // for (let i_deg = -179; i_deg <= 180; i_deg += 1) {
	for (let i_deg = -178; i_deg <= 180; i_deg += 2) {
		// console.log(i_deg);
		ctx.strokeStyle = getRayColor(i_deg);
		castRay(i_deg);
	}
	console.timeEnd("casting");

	// Plot TTs.
	// plotTTs();
}

redraw();

window.onresize = redraw;
