<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evaluation;
use App\Models\User;

class EvaluationController extends Controller
{
    public function index()
    {
        $evaluations = Evaluation::with(['employee', 'evaluator'])->latest()->get();
        return response()->json($evaluations);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'employee_id' => 'required|exists:users,id',
        'scores' => 'required|array',
        'scores.punctuality' => 'required|integer|min:0|max:10',
        'scores.attitude' => 'required|integer|min:0|max:10',
        'scores.quality' => 'required|integer|min:0|max:10',
        'scores.initiative' => 'required|integer|min:0|max:10',
        'scores.teamwork' => 'required|integer|min:0|max:10',
        'scores.trustworthy' => 'required|integer|min:0|max:10',
        'remarks' => 'nullable|array',
        'average_score' => 'nullable|numeric',
        'comments' => 'nullable|string',
    ]);

    $scores = $validated['scores'];

    $totalScore = $scores['punctuality'] +
                  $scores['attitude'] +
                  $scores['quality'] +
                  $scores['initiative'] +
                  $scores['teamwork'] +
                  $scores['trustworthy'];

    $evaluation = Evaluation::create([
        'user_id' => $validated['employee_id'],
        'evaluator_id' => auth()->id(),
        'punctuality' => $scores['punctuality'],
        'attitude' => $scores['attitude'],
        'quality_of_work' => $scores['quality'],
        'initiative' => $scores['initiative'],
        'teamwork' => $scores['teamwork'],
        'trustworthiness' => $scores['trustworthy'],
        'total_score' => $totalScore,
        'status' => 'Final', // or allow it to be passed in request
        'remarks' => json_encode($validated['remarks'] ?? []),
    ]);

    return response()->json(['message' => 'Evaluation submitted successfully.', 'data' => $evaluation]);
}


    public function show($id)
    {
        $evaluation = Evaluation::with(['employee', 'evaluator'])->findOrFail($id);
        return response()->json($evaluation);
    }

    public function update(Request $request, $id)
    {
        $evaluation = Evaluation::findOrFail($id);

        $validated = $request->validate([
            'punctuality' => 'required|integer|min:0|max:10',
            'attitude' => 'required|integer|min:0|max:10',
            'quality_of_work' => 'required|integer|min:0|max:10',
            'initiative' => 'required|integer|min:0|max:10',
            'teamwork' => 'required|integer|min:0|max:10',
            'trustworthiness' => 'required|integer|min:0|max:10',
            'status' => 'required|in:Draft,Final',
            'remarks' => 'nullable|string',
        ]);

        $totalScore = $validated['punctuality'] + $validated['attitude'] + $validated['quality_of_work']
                    + $validated['initiative'] + $validated['teamwork'] + $validated['trustworthiness'];

        $evaluation->update([
            ...$validated,
            'total_score' => $totalScore
        ]);

        return response()->json(['message' => 'Evaluation updated successfully.']);
    }

    public function destroy($id)
    {
        $evaluation = Evaluation::findOrFail($id);
        $evaluation->delete();

        return response()->json(['message' => 'Evaluation deleted successfully.']);
    }
}
