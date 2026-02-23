import { useRef, useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Search as SearchIcon, BookOpen, ListTree, X, ExternalLink, ArrowUp } from 'lucide-react';
import { apiFetch } from '../utils/api';
import Footer from '../components/Footer';

export default function InfoCenterPage() {
    const { hash } = useLocation();

    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [openSec, setOpenSec] = useState({});
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [activeItemId, setActiveItemId] = useState(null);

    const containerRef = useRef(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoadError(null);
                const json = await apiFetch('/info-center', { skipAuth: true });
                if (!alive) return;
                const secs = Array.isArray(json?.data?.sections) ? json.data.sections : [];
                setSections(secs);

                const defaults = Object.fromEntries(secs.map((s) => [s.id, true]));

                const firstSec = secs[0];
                const firstItem = firstSec?.items?.[0];
                let activeSecId = firstSec?.id || null;
                let activeItmId = firstItem?.id || null;

                const fromHashId = hash?.replace('#', '');
                if (fromHashId) {
                    const foundSec = secs.find((s) => (s.items || []).some((it) => it.id === fromHashId));
                    if (foundSec) {
                        activeSecId = foundSec.id;
                        activeItmId = fromHashId;
                    }
                }

                setOpenSec(defaults);
                setActiveSectionId(activeSecId);
                setActiveItemId(activeItmId);
            } catch (e) {
                if (!alive) return;
                setLoadError(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [hash]);

    const flatItems = useMemo(() => sections.flatMap((sec) => (sec.items || []).map((it) => ({ ...it, __sectionId: sec.id, __sectionTitle: sec.title }))), [sections]);

    const activeItem = useMemo(() => {
        const sec = sections.find((s) => s.id === activeSectionId);
        return sec?.items?.find((it) => it.id === activeItemId) || null;
    }, [sections, activeSectionId, activeItemId]);

    const results = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return [];
        return flatItems
            .filter((it) => {
                const hay = [it.title, it.summary, it.content, (it.tags || []).join(' ')].join(' ').toLowerCase() || '';
                return hay.includes(term);
            })
            .slice(0, 10);
    }, [flatItems, searchTerm]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setSearchOpen((s) => !s);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const scrollContentToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="p-20 text-center text-neutral-500 font-medium animate-pulse">Memuat pusat informasi...</div>;

    return (
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-[56px] md:top-[68px] z-30 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-10">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-200">
                            <BookOpen size={20} />
                        </Link>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold tracking-tight text-neutral-900 leading-tight">Pusat Informasi</h1>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Panduan & Bantuan GenBI</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2 text-sm text-neutral-500 transition-all hover:border-primary-300 hover:bg-white hover:shadow-sm"
                        >
                            <SearchIcon size={16} />
                            <span className="hidden md:inline">Cari panduan...</span>
                            <kbd className="hidden md:flex h-6 items-center gap-0.5 rounded-md border border-neutral-200 bg-white px-1.5 text-[10px] font-medium text-neutral-400">
                                <span className="text-xs">⌘</span>
                                <span>K</span>
                            </kbd>
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-[1440px] relative">
                {/* Sidebar Navigation */}
                <aside className="sticky top-[calc(56px+64px)] md:top-[calc(68px+64px)] hidden h-[calc(100vh-132px)] w-72 overflow-y-auto border-r border-neutral-100 bg-neutral-50/30 p-6 md:block scrollbar-thin scrollbar-thumb-neutral-200">
                    <nav className="space-y-6">
                        {sections.map((sec) => {
                            const isOpen = !!openSec[sec.id];
                            const hasActiveChild = (sec.items || []).some(it => it.id === activeItemId);

                            return (
                                <div key={sec.id} className="space-y-1">
                                    <button
                                        onClick={() => setOpenSec(prev => ({ ...prev, [sec.id]: !prev[sec.id] }))}
                                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-bold transition-colors ${hasActiveChild ? 'text-primary-600 bg-primary-50/50' : 'text-neutral-700 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <span>{sec.title}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="ml-2 space-y-0.5 border-l border-neutral-200 pl-3">
                                            {(sec.items || []).map((it) => (
                                                <button
                                                    key={it.id}
                                                    onClick={() => {
                                                        setActiveSectionId(sec.id);
                                                        setActiveItemId(it.id);
                                                        scrollContentToTop();
                                                    }}
                                                    className={`flex w-full rounded-md px-3 py-1.5 text-xs text-left transition-all ${it.id === activeItemId
                                                        ? 'bg-primary-600 font-bold text-white shadow-md'
                                                        : 'text-neutral-500 hover:bg-neutral-100'
                                                        }`}
                                                >
                                                    {it.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="min-w-0 flex-1 px-6 py-10 md:px-16 lg:px-24">
                    {activeItem ? (
                        <div className="max-w-[800px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-widest">
                                <span>Dokumentasi</span>
                                <ChevronRight size={10} />
                                <span className="truncate max-w-[120px]">{activeItem.__sectionTitle}</span>
                            </nav>

                            <div className="mb-10 border-b border-neutral-100 pb-10">
                                <h2 className="mb-4 text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
                                    {activeItem.title}
                                </h2>
                                {activeItem.summary && (
                                    <p className="text-lg leading-relaxed text-neutral-500 italic border-l-4 border-primary-500 pl-6 py-2 bg-primary-50/30 rounded-r-xl">
                                        {activeItem.summary}
                                    </p>
                                )}
                            </div>

                            <div
                                className="prose prose-neutral prose-lg max-w-none
                prose-headings:font-black prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:border-b prose-h2:border-neutral-100 prose-h2:pb-4
                prose-p:leading-relaxed prose-p:text-neutral-700
                prose-a:text-primary-600 prose-a:font-bold
                prose-img:rounded-3xl prose-img:shadow-2xl
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                "
                                dangerouslySetInnerHTML={{ __html: activeItem.content }}
                            />

                            <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-10">
                                {(() => {
                                    const idx = flatItems.findIndex((it) => it.id === activeItemId);
                                    const prev = flatItems[idx - 1];
                                    const next = flatItems[idx + 1];

                                    return (
                                        <>
                                            {prev ? (
                                                <button
                                                    onClick={() => { setActiveSectionId(prev.__sectionId); setActiveItemId(prev.id); scrollContentToTop(); }}
                                                    className="group flex w-full sm:w-auto flex-col items-start gap-2 rounded-2xl border border-neutral-100 p-6 transition-all hover:border-primary-200 hover:bg-neutral-50"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Previous</span>
                                                    <span className="text-lg font-bold text-neutral-700 group-hover:text-primary-700 flex items-center gap-2">
                                                        <ChevronDown className="rotate-90" size={18} />
                                                        {prev.title}
                                                    </span>
                                                </button>
                                            ) : <div />}

                                            {next ? (
                                                <button
                                                    onClick={() => { setActiveSectionId(next.__sectionId); setActiveItemId(next.id); scrollContentToTop(); }}
                                                    className="group flex w-full sm:w-auto flex-col items-end gap-2 rounded-2xl border border-neutral-100 p-6 transition-all hover:border-primary-200 hover:bg-neutral-50"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Next</span>
                                                    <span className="text-lg font-bold text-neutral-700 group-hover:text-primary-700 flex items-center gap-2">
                                                        {next.title}
                                                        <ChevronDown className="-rotate-90" size={18} />
                                                    </span>
                                                </button>
                                            ) : <div />}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <SearchIcon size={48} className="mx-auto text-neutral-200 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900">Buka panduan untuk membaca</h3>
                        </div>
                    )}
                </main>
            </div>
            <Footer />

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-neutral-900/60 p-4 pt-[15vh] backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="relative flex items-center border-b border-neutral-100 p-4">
                            <SearchIcon className="absolute left-6 text-neutral-400" size={20} />
                            <input
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari dalam dokumentasi..."
                                className="h-12 w-full bg-transparent pl-12 pr-12 text-lg focus:outline-none"
                            />
                            <button onClick={() => setSearchOpen(false)} className="absolute right-6 p-2 text-neutral-400 hover:text-neutral-900">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto p-2">
                            {results.map((it) => (
                                <button
                                    key={it.id}
                                    onClick={() => {
                                        setActiveSectionId(it.__sectionId);
                                        setActiveItemId(it.id);
                                        setSearchOpen(false);
                                        scrollContentToTop();
                                    }}
                                    className="w-full rounded-2xl p-4 text-left transition-colors hover:bg-primary-50 group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">{it.__sectionTitle}</span>
                                    <h4 className="text-base font-bold text-neutral-900 group-hover:text-primary-700">{it.title}</h4>
                                    {it.summary && <p className="text-sm text-neutral-500 line-clamp-1">{it.summary}</p>}
                                </button>
                            ))}
                            {searchTerm && results.length === 0 && <div className="p-10 text-center text-neutral-400">Tidak ada hasil ditemukan</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}