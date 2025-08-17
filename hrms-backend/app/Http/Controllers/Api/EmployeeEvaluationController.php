<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeEvaluation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeeEvaluationController extends Controller
{
    public function index(Request $request)
    {
        $evaluations = EmployeeEvaluation::with('employee', 'evaluator')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->whereHas('employee', function ($q) use ($request) {
                    $q->where('first_name', 'like', "%{$request->search}%")
                      ->orWhere('last_name', 'like', "%{$request->search}%");
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->orderBy('evaluation_date', 'desc')
            ->get();

        return response()->json($evaluations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'evaluation_date' => 'required|date',
            'job_title' => 'nullable|string',
            'date_hired' => 'nullable|date',
            'date_last_increased' => 'nullable|date',
            'beginning_rate' => 'nullable|numeric',
            'present_rate' => 'nullable|numeric',
            'rate_per_hour' => 'nullable|numeric',
            'punctuality_attendance' => 'nullable|integer|min:0|max:10',
            'attitude' => 'nullable|integer|min:0|max:10',
            'quality_of_work' => 'nullable|integer|min:0|max:10',
            'initiative' => 'nullable|integer|min:0|max:10',
            'teamwork' => 'nullable|integer|min:0|max:10',
            'trustworthy' => 'nullable|integer|min:0|max:10',
            'remarks' => 'nullable|string',
            'status' => 'required|in:draft,final',
        ]);

        $total = collect($validated)->only([
            'punctuality_attendance', 'attitude', 'quality_of_work',
            'initiative', 'teamwork', 'trustworthy'
        ])->filter()->sum();

        $evaluation = EmployeeEvaluation::create([
            ...$validated,
            'evaluator_id' => Auth::id(),
            'total_score' => $total,
        ]);

        $evaluation->load('employee', 'evaluator'); // Load relations

        return response()->json([
            'message' => 'Evaluation saved',
            'data' => $evaluation
        ]);

        return response()->json(['message' => 'Evaluation saved', 'data' => $evaluation]);
    }

    public function show($id)
    {
        $evaluation = EmployeeEvaluation::with('employee', 'evaluator')->findOrFail($id);
        return response()->json($evaluation);
    }

    public function update(Request $request, $id)
    {
        $evaluation = EmployeeEvaluation::findOrFail($id);

        $validated = $request->validate([
            'evaluation_date' => 'required|date',
            'job_title' => 'nullable|string',
            'date_hired' => 'nullable|date',
            'date_last_increased' => 'nullable|date',
            'beginning_rate' => 'nullable|numeric',
            'present_rate' => 'nullable|numeric',
            'rate_per_hour' => 'nullable|numeric',
            'punctuality_attendance' => 'nullable|integer|min:0|max:10',
            'attitude' => 'nullable|integer|min:0|max:10',
            'quality_of_work' => 'nullable|integer|min:0|max:10',
            'initiative' => 'nullable|integer|min:0|max:10',
            'teamwork' => 'nullable|integer|min:0|max:10',
            'trustworthy' => 'nullable|integer|min:0|max:10',
            'remarks' => 'nullable|string',
            'status' => 'required|in:draft,final',
        ]);

        $total = collect($validated)->only([
            'punctuality_attendance', 'attitude', 'quality_of_work',
            'initiative', 'teamwork', 'trustworthy'
        ])->filter()->sum();

        $evaluation->update([
            ...$validated,
            'total_score' => $total,
        ]);

        return response()->json(['message' => 'Evaluation updated']);
    }

    public function destroy($id)
    {
        $evaluation = EmployeeEvaluation::findOrFail($id);
        $evaluation->delete();

        return response()->json(['message' => 'Evaluation deleted']);
    }

    public function exportPdf($id)
    {
        $evaluation = EmployeeEvaluation::with('employee', 'evaluator')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.evaluation', ['evaluation' => $evaluation]);

        return $pdf->download('employee_evaluation_'.$evaluation->id.'.pdf');
    }
}
