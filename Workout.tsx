
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const workoutTypes = [
  "วิ่ง",
  "เดิน",
  "ว่ายน้ำ",
  "จักรยาน",
  "เวทเทรนนิ่ง",
  "โยคะ",
  "ฟุตบอล",
  "บาสเกตบอล",
  "แบดมินตัน",
  "เต้นแอโรบิค",
  "อื่นๆ"
];

const AddWorkout = () => {
  const { employee } = useAuth();
  const { addWorkout } = useWorkout();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [type, setType] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [customType, setCustomType] = useState("");
  
  if (!employee) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalType = type === "อื่นๆ" ? customType : type;
    const totalMinutes = (parseInt(hours) * 60 || 0) + (parseInt(minutes) || 0);
    
    addWorkout({
      employeeId: employee.id,
      type: finalType,
      duration: totalMinutes,
      date: date.toISOString(),
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container px-4 py-6 mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-muted-foreground"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          กลับไปหน้าหลัก
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="bg-gradient-workout text-white rounded-t-lg">
              <CardTitle>บันทึกการออกกำลังกาย</CardTitle>
              <CardDescription className="text-white/80">
                กรอกข้อมูลการออกกำลังกายของคุณ
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ประเภทการออกกำลังกาย</label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((workoutType) => (
                        <SelectItem key={workoutType} value={workoutType}>
                          {workoutType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {type === "อื่นๆ" && (
                  <div className="space-y-2">
                    <label htmlFor="customType" className="text-sm font-medium">
                      ระบุประเภทการออกกำลังกาย
                    </label>
                    <Input
                      id="customType"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="ระบุประเภทการออกกำลังกาย"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">วันที่</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : <span>เลือกวันที่</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto", isMobile ? "w-[280px]" : "")}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ระยะเวลา</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        className="pl-10"
                        placeholder="ชั่วโมง"
                      />
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="pl-10"
                        placeholder="นาที"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-workout"
                  disabled={!type || (!hours && !minutes) || !date || (type === "อื่นๆ" && !customType)}
                >
                  บันทึกการออกกำลังกาย
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddWorkout;
