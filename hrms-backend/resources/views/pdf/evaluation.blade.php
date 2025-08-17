<!DOCTYPE html>
<html>
<head>
    <title>Employee Evaluation</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .section { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h2>Employee Evaluation</h2>
    <div class="section">
        <strong>Employee:</strong> {{ $evaluation->employee->first_name }} {{ $evaluation->employee->last_name }}<br>
        <strong>Evaluator:</strong> {{ $evaluation->evaluator->name }}<br>
        <strong>Date:</strong> {{ $evaluation->evaluation_date }}
    </div>
    <div class="section">
        <strong>Scores:</strong><br>
        Punctuality/Attendance: {{ $evaluation->punctuality_attendance }}<br>
        Attitude: {{ $evaluation->attitude }}<br>
        Quality of Work: {{ $evaluation->quality_of_work }}<br>
        Initiative: {{ $evaluation->initiative }}<br>
        Teamwork: {{ $evaluation->teamwork }}<br>
        Trustworthy: {{ $evaluation->trustworthy }}<br>
        <strong>Total Score:</strong> {{ $evaluation->total_score }}
    </div>
    <div class="section">
        <strong>Remarks:</strong> {{ $evaluation->remarks }}
    </div>
</body>
</html>