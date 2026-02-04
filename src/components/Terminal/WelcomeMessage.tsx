export function WelcomeMessage() {
	return (
		<div className="mb-6 pb-6 border-b border-cyan-400/20">
			{/* Welcome header */}
			<div className="mb-4">
				<div className="text-lime-400 font-bold text-sm mb-1">
					✓ Sistema interactivo iniciado
				</div>
				<div className="text-gray-400 text-sm">
					Escribe comandos para conocer más sobre mí
				</div>
			</div>

			{/* Command list - Clean version */}
			<div className="text-cyan-400 space-y-1 text-sm">
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">whoami</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Perfil profesional</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">skills</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Stack tecnológico</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">experience</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Trayectoria profesional</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">projects</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Proyectos destacados</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">hobbies</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Intereses personales</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">contact</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Información de contacto</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">help</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Mostrar comandos</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-lime-400 font-bold">clear</span>
					<span className="text-gray-500">—</span>
					<span className="text-gray-400">Limpiar terminal</span>
				</div>
			</div>
		</div>
	);
}
