import React, { useState, useEffect } from 'react';
import { RefreshCw, Volume2, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HumanVerification = () => {
  const [currentStep, setCurrentStep] = useState('checkbox'); // 'checkbox', 'captcha', 'verified'
  const [isLoading, setIsLoading] = useState(false);
  const [captchaType, setCaptchaType] = useState('text'); // 'text', 'images'
  const [userInput, setUserInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate()

  // Text CAPTCHA data
  const [textCaptcha, setTextCaptcha] = useState('');
  
  // Image CAPTCHA data
  const [imageChallenge, setImageChallenge] = useState({
    question: 'Select all images with traffic lights',
    images: []
  });

  const handleSubmit=()=>{
    navigate("/system-update")
  }

  const generateTextCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTextCaptcha(result);
  };

  const generateImageChallenge = () => {
    const challenges = [
      { question: 'Select all images with traffic lights', target: '🚦' },
      { question: 'Select all images with cars', target: '🚗' },
      { question: 'Select all images with buildings', target: '🏢' },
      { question: 'Select all images with trees', target: '🌳' }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const distractors = ['🏠', '🛣️', '🌆', '⛽', '🚶', '🏪', '🚲', '🌅'];
    
    const images = [];
    const correctIndices = [];
    
    for (let i = 0; i < 9; i++) {
      const isCorrect = Math.random() > 0.6;
      if (isCorrect) {
        correctIndices.push(i);
        images.push({
          id: i,
          emoji: challenge.target,
          isCorrect: true
        });
      } else {
        images.push({
          id: i,
          emoji: distractors[Math.floor(Math.random() * distractors.length)],
          isCorrect: false
        });
      }
    }
    
    setImageChallenge({
      question: challenge.question,
      images,
      correctIndices
    });
  };

  useEffect(() => {
    generateTextCaptcha();
    generateImageChallenge();
  }, []);

  const handleCheckboxClick = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // 80% chance of requiring CAPTCHA
      if (Math.random() < 0.8) {
        setCurrentStep('captcha');
      } else {
        setCurrentStep('verified');
      }
    }, 2000);
  };

  const handleCaptchaSubmit = () => {
    let isCorrect = false;
    
    if (captchaType === 'text') {
      isCorrect = userInput.toLowerCase() === textCaptcha.toLowerCase();
    } else {
      const correctSet = new Set(imageChallenge.correctIndices);
      const selectedSet = new Set(selectedImages);
      isCorrect = correctSet.size === selectedSet.size && 
                 [...correctSet].every(x => selectedSet.has(x));
    }

    if (isCorrect) {
      setCurrentStep('verified');
      setShowError(false);
    } else {
      setAttempts(prev => prev + 1);
      setShowError(true);
      
      if (attempts >= 2) {
        // Reset after 3 attempts
        setCurrentStep('checkbox');
        setAttempts(0);
        setUserInput('');
        setSelectedImages([]);
      }
      
      // Generate new challenges
      generateTextCaptcha();
      generateImageChallenge();
      setUserInput('');
      setSelectedImages([]);
      
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const refreshCaptcha = () => {
    if (captchaType === 'text') {
      generateTextCaptcha();
    } else {
      generateImageChallenge();
    }
    setUserInput('');
    setSelectedImages([]);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleCancel = () => {
    setCurrentStep('checkbox');
    setUserInput('');
    setSelectedImages([]);
    setAttempts(0);
    setShowError(false);
  };

  // Verified state
  if (currentStep === 'verified') {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
            Verification Complete
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you! You have been successfully verified as a human user.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-medium transition-colors"
            >
              Continue
            </button>
            <button
              onClick={handleCancel}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-full font-medium transition-colors"
            >
              Verify Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CAPTCHA challenge state
  if (currentStep === 'captcha') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-light text-gray-800">
                Verification
              </h1>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Sorry, we need to check you're a genuine user
            </p>
          </div>

          {/* Challenge Content */}
          <div className="p-6">
            {showError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Incorrect answer. Please try again. ({3 - attempts} attempts remaining)
                </p>
              </div>
            )}

            {captchaType === 'text' ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4">
                    <div 
                      className="text-2xl md:text-3xl font-bold tracking-wider select-none"
                      style={{
                        fontFamily: 'monospace',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        transform: 'skew(-8deg) rotate(-2deg)',
                        background: 'linear-gradient(45deg, #f0f0f0, #ffffff)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text'
                      }}
                    >
                      {textCaptcha}
                    </div>
                    <button
                      onClick={refreshCaptcha}
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Get new image"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alert('Audio: ' + textCaptcha.split('').join(' '))}
                      className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Audio challenge"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  If you can't read this, <button 
                    onClick={() => setCaptchaType('images')} 
                    className="text-blue-600 hover:underline"
                  >
                    try another one
                  </button>
                </p>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Enter the characters in the box
                  </label>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg"
                    placeholder="Type what you see"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-800">
                    {imageChallenge.question}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={refreshCaptcha}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="New challenge"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCaptchaType('text')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Text challenge"
                    >
                      <span className="text-sm font-medium">ABC</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {imageChallenge.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => toggleImageSelection(image.id)}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center text-4xl md:text-5xl transition-all hover:bg-gray-50 ${
                        selectedImages.includes(image.id)
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-300'
                      }`}
                    >
                      {image.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCaptchaSubmit}
                disabled={
                  (captchaType === 'text' && !userInput.trim()) ||
                  (captchaType === 'images' && selectedImages.length === 0)
                }
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial checkbox state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 text-center">
          Human Verification
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Are you a robot? We hope not. Please check the box below.
        </p>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="checkbox"
                  id="robot-check"
                  className="w-6 h-6 text-green-600 bg-white border-2 border-gray-400 rounded focus:ring-green-500 focus:ring-2"
                  onChange={handleCheckboxClick}
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <label htmlFor="robot-check" className="text-gray-800 font-medium select-none">
                I'm not a robot
              </label>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center leading-tight">
                <div>reCAPTCHA</div>
                <div className="text-[10px]">Privacy - Terms</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 px-6 rounded-full font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            disabled
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-full font-medium opacity-50 cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanVerification;