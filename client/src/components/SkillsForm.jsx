import { Plus, Sparkles, X, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobSuggestions, setJobSuggestions] = useState([])

  const { token } = useSelector(state => state.auth)

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  // 🔥 AI JOB SUGGESTION
  const generateJobSuggestions = async () => {
    if (data.length === 0) {
      toast.error("Please add at least one skill")
      return
    }

    try {
      setIsGenerating(true)

      const prompt = `Analyze these skills: ${data.join(
        ", "
      )}. Suggest 5 suitable job roles with a short description for each.`

      const response = await api.post(
        '/api/ai/suggest-jobs',
        { userContent: prompt },
        { headers: { Authorization: token } }
      )

      setJobSuggestions(response.data.suggestions)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-4'>
      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Skills</h3>
          <p className='text-sm text-gray-500'>
            Add your technical and soft skills
          </p>
        </div>

        <button
          onClick={generateJobSuggestions}
          disabled={isGenerating}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50'
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Analyzing..." : "AI Suggest Jobs"}
        </button>
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript, Communication)"
          className='flex-1 px-3 py-2 text-sm border rounded-lg'
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {/* SKILLS LIST */}
      {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {data.map((skill, index) => (
            <span
              key={index}
              className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className='text-center py-6 text-gray-500'>
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Add your technical and soft skills above.</p>
        </div>
      )}

      {/* AI RESULTS */}
      {jobSuggestions.length > 0 && (
        <div className='bg-purple-50 p-4 rounded-lg'>
          <h4 className='text-sm font-semibold text-purple-900 mb-2'>
            AI Suggested Job Roles
          </h4>
          <ul className='list-disc pl-5 space-y-1 text-sm text-purple-800'>
            {jobSuggestions.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        </div>
      )}

      {/* TIP */}
      <div className='bg-blue-50 p-3 rounded-lg'>
        <p className='text-sm text-blue-800'>
          <strong>Tip:</strong> Add 8–12 relevant skills including both technical
          and soft skills.
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
