<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;

class LeaveRequestController extends Controller
{
     public function index() {
        return LeaveRequest::with('user')->latest()->get();
    }

    public function show($id) {
        return LeaveRequest::with('user')->findOrFail($id);
    }

    public function approve($id) {
        $leave = LeaveRequest::findOrFail($id);
        $leave->status = 'approved';
        $leave->admin_remarks = request('remarks');
        $leave->save();

        // Update leave credits here (optional)
        return response()->json(['message' => 'Leave approved']);
    }

    public function reject($id) {
        $leave = LeaveRequest::findOrFail($id);
        $leave->status = 'rejected';
        $leave->admin_remarks = request('remarks');
        $leave->save();

        return response()->json(['message' => 'Leave rejected']);
    }

    public function export(Request $request) {
        $type = $request->get('type', 'csv');
        $leaves = LeaveRequest::with('user')->get();

        if ($type === 'csv') {
            $csv = "Employee,Leave Type,Start Date,End Date,Status\n";
            foreach ($leaves as $leave) {
                $csv .= "{$leave->user->name},{$leave->leave_type},{$leave->start_date},{$leave->end_date},{$leave->status}\n";
            }

            return response($csv)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename=leaves.csv');
        }

        

        // You can integrate PDF generation here (e.g. DOMPDF or Snappy)
    }
}