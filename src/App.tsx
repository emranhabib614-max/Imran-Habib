import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Upload, Image as ImageIcon, Loader2, Download, RefreshCw, AlertCircle, Scissors, Eraser, ImagePlus, Palette, Square, RectangleHorizontal, RectangleVertical, Sparkles, Waves, ArrowLeft, Wand2, LayoutGrid, Replace, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type AppState = 'splash' | 'home' | 'workspace';
type Feature = 'edit' | 'generate' | 'replace_sub' | 'collage' | 'remove_obj' | 'enhance';
type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
type Quality = 'standard' | 'high';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [feature, setFeature] = useState<Feature>('edit');

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('home'), 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 text-neutral-900 font-sans overflow-x-hidden selection:bg-cyan-200 selection:text-cyan-900">
      <AnimatePresence mode="wait">
        {appState === 'splash' && <SplashScreen key="splash" />}
        {appState === 'home' && <HomeScreen key="home" onSelect={(f) => { setFeature(f); setAppState('workspace'); }} />}
        {appState === 'workspace' && <WorkspaceScreen key="workspace" feature={feature} onBack={() => setAppState('home')} />}
      </AnimatePresence>
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600">
      <motion.div
        initial={{ x: -200, y: 50, rotate: -20 }}
        animate={{ x: [-200, 0, 100, 300], y: [50, -50, 20, -20], rotate: [-20, 20, -10, 10] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="text-9xl drop-shadow-2xl"
      >🐬</motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-6xl font-black text-white mt-8 tracking-tight drop-shadow-lg">
        Dolphin
      </motion.h1>
    </motion.div>
  );
}

function HomeScreen({ onSelect }: { onSelect: (f: Feature) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl text-white shadow-md"><Waves className="w-5 h-5" /></div>
          <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">Dolphin</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16 relative">
           <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
           <h2 className="text-5xl font-extrabold tracking-tight text-neutral-900 mb-4 relative z-10">
             Dive into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Creativity</span>
           </h2>
           <p className="text-lg text-neutral-600 max-w-2xl mx-auto relative z-10">
             Extract subjects, remove backgrounds, replace scenes, or stylize your photos instantly using Google's powerful Gemini AI. 100% free.
           </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HomeCard icon={<ImagePlus className="w-8 h-8"/>} title="1. Add Image (Edit)" desc="Extract, remove BG, or stylize photos." onClick={() => onSelect('edit')} />
          <HomeCard icon={<Wand2 className="w-8 h-8"/>} title="2. Image Generation" desc="Create images from text descriptions." onClick={() => onSelect('generate')} />
          <HomeCard icon={<Replace className="w-8 h-8"/>} title="3. Replace Subject" desc="Swap the main subject of an image." onClick={() => onSelect('replace_sub')} />
          <HomeCard icon={<LayoutGrid className="w-8 h-8"/>} title="4. Make Collage" desc="Combine multiple images creatively." onClick={() => onSelect('collage')} />
          <HomeCard icon={<Eraser className="w-8 h-8"/>} title="5. Remove Object" desc="Erase unwanted objects from your photo." onClick={() => onSelect('remove_obj')} />
          <HomeCard icon={<Sparkles className="w-8 h-8"/>} title="6. Enhance Image" desc="Upscale and improve image quality." onClick={() => onSelect('enhance')} />
        </div>
      </main>
    </motion.div>
  );
}

function HomeCard({ icon, title, desc, onClick }: any) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="bg-white/60 backdrop-blur-sm border-2 border-cyan-100 p-8 rounded-3xl cursor-pointer hover:border-cyan-400 hover:bg-white transition-all shadow-xl shadow-cyan-100/50 flex flex-col items-center text-center group">
      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform text-cyan-600 shadow-inner">{icon}</div>
      <h3 className="text-2xl font-bold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-500 font-medium">{desc}</p>
    </motion.div>
  );
}

function WorkspaceScreen({ feature, onBack }: { feature: Feature, onBack: () => void }) {
  const [images, setImages] = useState<{ url: string; base64: string; mimeType: string }[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<Quality>('standard');
  const [editMode, setEditMode] = useState<'extract'|'remove'|'replace'|'style'>('extract');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxImages = feature === 'collage' ? 4 : 1;
  const needsImage = feature !== 'generate';

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        setImages(prev => prev.length >= maxImages ? prev : [...prev, { url: dataUrl, base64, mimeType: file.type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const process = async () => {
    setIsProcessing(true); setError(null); setResultImage(null);
    try {
      let parts: any[] = [];
      const qualityPrompt = quality === 'high' ? ' Masterpiece, highest quality, highly detailed, 8k resolution, professional.' : '';
      
      if (feature === 'edit') {
        if (!images[0]) throw new Error("Upload an image.");
        parts.push({ inlineData: { data: images[0].base64, mimeType: images[0].mimeType } });
        let p = prompt;
        if (editMode === 'extract') p = 'Extract the main subject and place it on a pure white background.';
        else if (editMode === 'remove') p = 'Remove the main subject and reconstruct the background.';
        else if (editMode === 'replace') p = `Keep the main subject, replace background with: ${prompt || 'scenic landscape'}.`;
        else if (editMode === 'style') p = `Redraw this image in the style: ${prompt || 'cyberpunk'}.`;
        parts.push({ text: p + qualityPrompt });
      } else if (feature === 'generate') {
        if (!prompt) throw new Error("Enter a prompt.");
        parts.push({ text: prompt + qualityPrompt });
      } else if (feature === 'replace_sub') {
        if (!images[0]) throw new Error("Upload an image.");
        if (!prompt) throw new Error("Enter what to replace the subject with.");
        parts.push({ inlineData: { data: images[0].base64, mimeType: images[0].mimeType } });
        parts.push({ text: `Replace the main subject of this image with: ${prompt}. Keep the background exactly the same.` + qualityPrompt });
      } else if (feature === 'collage') {
        if (images.length < 2) throw new Error("Upload at least 2 images.");
        images.forEach(img => parts.push({ inlineData: { data: img.base64, mimeType: img.mimeType } }));
        parts.push({ text: `Create a beautiful, cohesive artistic collage combining all these images. ${prompt}` + qualityPrompt });
      } else if (feature === 'remove_obj') {
        if (!images[0]) throw new Error("Upload an image.");
        if (!prompt) throw new Error("Enter what object to remove.");
        parts.push({ inlineData: { data: images[0].base64, mimeType: images[0].mimeType } });
        parts.push({ text: `Remove the following object from the image and seamlessly fill in the background: ${prompt}.` + qualityPrompt });
      } else if (feature === 'enhance') {
        if (!images[0]) throw new Error("Upload an image.");
        parts.push({ inlineData: { data: images[0].base64, mimeType: images[0].mimeType } });
        parts.push({ text: `Enhance this image, upscale it, improve the lighting, sharpness, and overall quality. Make it look professional and high-resolution.` + qualityPrompt });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio } }
      });

      let generatedUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          generatedUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
      if (generatedUrl) setResultImage(generatedUrl);
      else throw new Error("No image generated.");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const titleMap = { edit: 'Edit Image', generate: 'Image Generation', replace_sub: 'Replace Subject', collage: 'Make Collage', remove_obj: 'Remove Object', enhance: 'Enhance Image' };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-cyan-50 rounded-full text-cyan-700 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-xl font-bold text-neutral-800">{titleMap[feature]}</h1>
          </div>
          <button onClick={() => { setImages([]); setResultImage(null); setPrompt(''); }} className="text-sm font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-cyan-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-cyan-100 p-6 shadow-xl shadow-cyan-100/40">
            
            {needsImage && (
              <div className="mb-6">
                <label className="text-sm font-bold text-neutral-700 mb-2 block">Upload Image(s) {feature === 'collage' && '(Max 4)'}</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-cyan-300 rounded-2xl bg-cyan-50/50 p-6 text-center hover:bg-cyan-100/50 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-cyan-700">Click to upload</span>
                  <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" multiple={feature === 'collage'} className="hidden" />
                </div>
              </div>
            )}

            {feature === 'edit' && (
              <div className="mb-6 space-y-2">
                <label className="text-sm font-bold text-neutral-700">Edit Tool</label>
                <div className="grid grid-cols-2 gap-2">
                  {['extract', 'remove', 'replace', 'style'].map((m) => (
                    <button key={m} onClick={() => setEditMode(m as any)} className={`p-2 rounded-xl border-2 text-xs font-bold capitalize ${editMode === m ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-transparent bg-neutral-50 text-neutral-600 hover:bg-cyan-50/50'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(feature === 'generate' || feature === 'replace_sub' || feature === 'collage' || feature === 'remove_obj' || (feature === 'edit' && (editMode === 'replace' || editMode === 'style'))) && (
              <div className="mb-6">
                <label className="text-sm font-bold text-neutral-700 mb-2 block">Prompt</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={feature === 'remove_obj' ? "Describe the object to remove..." : "Describe what you want..."} className="w-full border-2 border-cyan-100 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none resize-none h-24 bg-white/50" />
              </div>
            )}

            <div className="mb-6">
              <label className="text-sm font-bold text-neutral-700 mb-2 block">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {['1:1', '16:9', '9:16', '4:3', '3:4'].map(r => (
                  <button key={r} onClick={() => setAspectRatio(r as any)} className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${aspectRatio === r ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-transparent bg-neutral-50 text-neutral-600 hover:bg-cyan-50/50'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm font-bold text-neutral-700 mb-2 block">Output Quality</label>
              <div className="flex bg-white/50 border-2 border-cyan-100 rounded-xl p-1">
                <button onClick={() => setQuality('standard')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${quality === 'standard' ? 'bg-cyan-500 text-white shadow-md' : 'text-neutral-600 hover:bg-cyan-50'}`}>Standard</button>
                <button onClick={() => setQuality('high')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${quality === 'high' ? 'bg-cyan-500 text-white shadow-md' : 'text-neutral-600 hover:bg-cyan-50'}`}>High Quality</button>
              </div>
            </div>

            <button onClick={process} disabled={isProcessing} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-200 flex items-center justify-center gap-2">
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Generate</>}
            </button>
            
            {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0"/>{error}</div>}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {needsImage && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-neutral-500 uppercase">Input Image(s)</h3>
                <div className="bg-white/50 rounded-3xl border-2 border-dashed border-cyan-200 p-2 aspect-square overflow-y-auto">
                  {images.length > 0 ? (
                    <div className={`grid gap-2 h-full ${images.length > 1 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'}`}>
                      {images.map((img, i) => (
                        <img key={i} src={img.url} className="w-full h-full object-cover rounded-2xl" alt={`Input ${i}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300"><ImageIcon className="w-12 h-12 opacity-50" /></div>
                  )}
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-3 ${!needsImage ? 'md:col-span-2 max-w-2xl mx-auto w-full' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-cyan-600 uppercase">Result</h3>
                {resultImage && (
                  <button onClick={() => { const a = document.createElement('a'); a.href = resultImage; a.download = 'dolphin-magic.png'; a.click(); }} className="text-white text-xs font-bold flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 rounded-full shadow-md">
                    <Download className="w-3 h-3" /> Save
                  </button>
                )}
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-cyan-200 overflow-hidden shadow-lg shadow-cyan-100/50 aspect-square relative flex items-center justify-center">
                {resultImage ? (
                  <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                ) : isProcessing ? (
                  <div className="flex flex-col items-center text-cyan-500 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="text-sm font-bold animate-pulse">Dolphin is swimming...</span>
                  </div>
                ) : (
                  <div className="text-cyan-300 flex flex-col items-center gap-2">
                    <Sparkles className="w-10 h-10 opacity-50" />
                    <span className="text-sm font-medium text-cyan-600/50">Ready to generate</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

