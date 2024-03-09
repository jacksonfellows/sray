let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");

ctx.scale(canvas.width/150, canvas.height/100);

ctx.lineWidth = 0.1;

function v(z) {
	return 5 + 0.25*z;
}

function castRay(i_deg) {
	let i = i_deg*Math.PI/180;
	let z = 0;
	let p = Math.sin(i)/v(z);

	let x = 5;

	ctx.beginPath();

	ctx.lineTo(x, z);

	let dz = 0.001;
	while (1) {
		z += dz;
		let v_z = v(z);
		let eta = Math.sqrt(1/(v_z*v_z) - p*p);
		if (isNaN(eta) || eta < 1e-3) {
			// Bottomed.
			dz = -dz;
			continue;
		}
		x += p/eta*Math.abs(dz);
		if (z >= 0) {
			ctx.lineTo(x, z);
		}
		else {
			break;
		}
	}

	ctx.stroke();
}

console.time("casting");
for (let i_deg = 10; i_deg < 40; i_deg++) {
	castRay(i_deg);
}
console.timeEnd("casting");
