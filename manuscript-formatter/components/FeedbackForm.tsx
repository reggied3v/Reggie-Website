'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackForm as FeedbackFormType } from '@/types';

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackFormType) => void;
  onSkip: () => void;
}

export default function FeedbackForm({ onSubmit, onSkip }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormType>({
    wasHelpful: false,
    easyToUse: false,
    formattingAccurate: false,
    wouldRecommend: false,
    additionalComments: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };

  const questions = [
    { id: 'wasHelpful', label: 'This tool was helpful' },
    { id: 'easyToUse', label: 'The tool was easy to use' },
    { id: 'formattingAccurate', label: 'The formatting was accurate' },
    { id: 'wouldRecommend', label: 'I would recommend this to others' }
  ];

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Thank you for your feedback!
            </h3>
            <p className="text-muted-foreground mt-2">
              Your input helps us improve Manuscript Formatter.
            </p>
            <Button
              onClick={onSkip}
              variant="default"
              className="mt-6"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Feedback</CardTitle>
          <CardDescription>
            Help us improve! This will only take 30 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Questions */}
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={question.id}
                    checked={formData[question.id as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, [question.id]: checked })
                    }
                  />
                  <Label
                    htmlFor={question.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {question.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-medium">
                Additional comments (optional)
              </Label>
              <Textarea
                id="comments"
                value={formData.additionalComments}
                onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                rows={3}
                placeholder="Any suggestions or issues?"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Submit Feedback
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onSkip}
              >
                Skip
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
