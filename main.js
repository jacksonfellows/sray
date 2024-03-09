let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");

xMax = 200;
zMax = 70;

ctx.scale(canvas.width/xMax, canvas.height/zMax);

function inBounds(x, z) {
	return 0 <= x && x < xMax && 0 <= z && z < zMax;
}

VM = [[0, 5], [100, 8]];

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
	let i = i_deg*Math.PI/180;
	let z = 5;
	let p = Math.sin(i)/v(z);

	let x = 10;

	ctx.beginPath();

	ctx.lineTo(x, z);

	let dz = 0.001;

	if (90 <= i_deg && i_deg <= 270) {
		dz = -dz;				// Start going up.
	}

	while (1) {
		z += dz;
		let v_z = v(z);
		let eta = Math.sqrt(1/(v_z*v_z) - p*p);
		if (dz > 0 && (isNaN(eta) || eta < 1e-3)) {
			// Bottomed.
			dz = -dz;
			continue;
		}
		x += p/eta*Math.abs(dz);
		if (inBounds(x, z)) {
			ctx.lineTo(x, z);
		}
		else {
			console.log(x, z);
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

console.time("casting");
for (let i_deg = 0; i_deg < 360; i_deg += 3) {
	castRay(i_deg);
}
console.timeEnd("casting");
