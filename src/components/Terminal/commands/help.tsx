export function help() {
	return (
		<div className="space-y-1">
			<div className="text-scarlet-rush mb-2">Comandos disponibles:</div>
			<div className="pl-4 space-y-1">
				<div>
					<span className="text-taupe">whoami</span> - Información básica
				</div>
				<div>
					<span className="text-taupe">skills</span> - Habilidades técnicas
				</div>
				<div>
					<span className="text-taupe">experience</span> - Experiencia laboral
				</div>
				<div>
					<span className="text-taupe">projects</span> - Proyectos destacados
				</div>
				<div>
					<span className="text-taupe">hobbies</span> - Intereses personales
				</div>
				<div>
					<span className="text-taupe">contact</span> - Información de contacto
				</div>
				<div>
					<span className="text-taupe">clear</span> - Limpiar terminal
				</div>
			</div>
		</div>
	);
}
