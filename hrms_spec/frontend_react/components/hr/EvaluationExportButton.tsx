export function EvaluationExportButton({ evaluationId }:{ evaluationId: number }) {
	function openExport() {
		window.open(`/api/performance/reviews/${evaluationId}/export`, '_blank');
	}
	return (
		<button onClick={openExport} className="px-3 py-1 bg-gray-700 text-white rounded">Export</button>
	);
}