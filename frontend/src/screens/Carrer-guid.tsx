"use client";
import { CarrerGuideResponse, utils_services } from "@/type";
import axios from "axios";
import { Sparkle, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CarrerGuid = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CarrerGuideResponse | null>(null);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill)) {
      setSkills((prevSkills) => [...prevSkills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToRemove),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  const CarrerGuideResponse = async () => {
    if (skills.length === 0) {
      alert("Please enter some skills");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(`${utils_services}/api/utils/career`, {
        skills: skills.join(", "),
      });

      setResponse(data);
    } catch (error: any) {
      alert(
        "Error generating career guidance: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 mb-4">
          <Sparkle size={16} className="text-blue-600" />

          <span className="text-sm font-medium">
            AI-Powered Career Guidance
          </span>
        </div>
      </div>

      <div className="p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Sparkle size={16} className="text-blue-400" />
              Get Career Guidance
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {!response ? (
              <>
                <DialogHeader>
                  <DialogTitle>Tell us About Your Skills</DialogTitle>
                  <DialogDescription>
                    Add technical skills to get career guidance
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                  {/* Input Section */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g. React, Python, Figma"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                      <Button onClick={addSkill} type="button">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Skills Display Section (The "Tags") */}
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <Button
                    disabled={skills.length === 0 || loading}
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    onClick={CarrerGuideResponse}
                  >
                    {loading ? "Generating..." : "Generate Guidance"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-6">
                <DialogHeader>
                  <DialogTitle>Your Career Path</DialogTitle>
                  <DialogDescription>{response.summary}</DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  {/* Job Options */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-700">
                      Recommended Job Roles
                    </h4>
                    <div className="space-y-3">
                      {response.jobOptions.map((job, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <h5 className="font-medium text-gray-900">
                            {job.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.responsibilities}
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            Why fit: {job.why}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Learn */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-700">
                      Skills to Learn
                    </h4>
                    <div className="space-y-4">
                      {response.skillsToLearn.map((category, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">
                            {category.category}
                          </h5>
                          <div className="space-y-2">
                            {category.skills.map((skill, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="bg-gray-50 rounded p-2 text-sm"
                              >
                                <span className="font-medium text-blue-700">
                                  {skill.title}
                                </span>
                                <p className="text-gray-600 mt-1">
                                  {skill.why}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  How: {skill.how}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Approach */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-purple-700">
                      Learning Approach
                    </h4>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">
                        {response.learningApproach.title}
                      </p>
                      <ul className="space-y-1">
                        {response.learningApproach.points.map(
                          (point, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start"
                            >
                              <span className="mr-2">•</span>
                              {point}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setResponse(null)}
                  >
                    Back to Skills
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={resetDialog}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CarrerGuid;
