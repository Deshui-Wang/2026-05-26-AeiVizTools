
const fs = require('fs');

const window = {
    addEventListener: () => {}
};
const localStorage = {
    getItem: () => {},
    setItem: () => {}
};
const document = {
    getElementById: (id) => {
        if (id === 'course-template') {
            return { textContent: `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} 3D 可视化教学 - AetherViz</title>
    
    <!-- Tailwind CSS -->
    [[SCRIPT_TAILWIND]]
    [[SCRIPT_TAILWIND_CONFIG]]

    <!-- KaTeX CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
    [[SCRIPT_KATEX_JS]]
    [[SCRIPT_KATEX_AUTO_RENDER]]

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-gradient: {{COLOR_GRADIENT}};
            --bg-gradient: {{BG_GRADIENT}};
            --glass-bg: rgba(10, 18, 36, 0.7);
            --glass-border: rgba(255, 255, 255, 0.12);
            --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.55);
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: var(--bg-gradient);
            color: #F8FAFC;
            overflow: hidden;
            height: 100vh;
        }

        ::-webkit-scrollbar {
            width: 5px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.2);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.25);
            border-radius: 3px;
        }

        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
        }

        .glow-active {
            box-shadow: 0 0 15px {{SUBJECT_COLOR}}50;
        }

        .custom-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 3px;
            outline: none;
        }
        .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: {{SUBJECT_COLOR}};
            cursor: pointer;
            box-shadow: 0 0 8px {{SUBJECT_COLOR}};
            transition: transform 0.1s;
        }
        .custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.3);
        }
    </style>
</head>
<body class="flex flex-col h-screen overflow-hidden select-none">

    <!-- 顶部导航 -->
    <header class="h-16 shrink-0 border-b border-white/10 bg-slate-950/80 px-6 flex items-center justify-between z-50">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-slate-950">A</div>
            <div>
                <h1 class="text-base font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
                    {{TITLE}} <span class="text-xs font-normal text-slate-500 normal-case ml-1">Interactive Laboratory</span>
                </h1>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <button id="btn-reset" class="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 active:scale-95 transition-all">
                重置实验
            </button>
            <button id="btn-play-pause" class="px-3 py-1.5 rounded-lg bg-white text-slate-950 text-xs font-bold hover:bg-slate-200 active:scale-95 transition-all">
                开始/暂停模拟
            </button>
        </div>
    </header>

    <!-- 主体区域 -->
    <main class="flex flex-1 relative overflow-hidden">
        
        <!-- 左侧讲解面板 -->
        <aside class="w-[360px] h-full shrink-0 border-r border-white/10 bg-slate-950/80 flex flex-col p-5 overflow-y-auto gap-4 z-40 relative">
            <!-- 学习目标 -->
            <section class="glass-panel rounded-xl p-4 flex flex-col gap-2">
                <h3 class="text-xs font-bold text-[{{SUBJECT_COLOR}}] uppercase tracking-wider flex items-center gap-1.5">
                    🎯 学习目标
                </h3>
                <ul class="text-xs text-slate-300 flex flex-col gap-2">
                    <li class="flex items-start gap-2">
                        <input type="checkbox" checked disabled class="mt-0.5 rounded cursor-pointer">
                        <span class="leading-relaxed">掌握该科学模型的核心理论及变量关联。</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <input type="checkbox" id="goal-2" class="accent-[{{SUBJECT_COLOR}}] w-3.5 h-3.5 mt-0.5 rounded cursor-pointer">
                        <label for="goal-2" class="leading-relaxed cursor-pointer hover:text-slate-300">利用滑块控制模拟因子，观察粒子反应极限。</label>
                    </li>
                </ul>
            </section>

            <!-- 核心数学公式 -->
            <section class="glass-panel rounded-xl p-4 flex flex-col gap-2">
                <h3 class="text-xs font-bold text-[{{SUBJECT_COLOR}}] uppercase tracking-wider flex items-center gap-1.5">
                    📝 核心推导公式
                </h3>
                <div class="bg-slate-900/60 rounded-lg p-3 border border-white/5 text-center">
                    <div id="latex-formula" class="text-sm text-slate-100 py-1.5"></div>
                </div>
                <p class="text-[10px] text-slate-400 leading-relaxed">
                    公式符号说明：{{SYMBOLS}}。
                </p>
            </section>

            <!-- 生动原理讲解 -->
            <section class="glass-panel rounded-xl p-4 flex flex-col gap-3">
                <h3 class="text-xs font-bold text-[{{SUBJECT_COLOR}}] uppercase tracking-wider flex items-center gap-1.5">
                    💡 生动比喻与直觉
                </h3>
                <div class="text-xs text-slate-300 flex flex-col gap-3 leading-relaxed">
                    <div>
                        <span class="text-amber-300 font-semibold">❓ 如何建立感性认知？</span>
                        <p class="mt-1 text-slate-400">{{METAPHOR}}</p>
                    </div>
                    <div class="border-t border-white/5 pt-2">
                        <span class="text-teal-300 font-semibold">🔬 核心原理解析</span>
                        <p class="mt-1 text-slate-400">{{PRINCIPLE}}</p>
                    </div>
                </div>
            </section>
        </aside>

        <!-- 3D 渲染与控制 -->
        <div class="flex-1 h-full relative flex flex-col">
            <!-- 3D Canvas 容器 -->
            <div id="canvas-container" class="absolute inset-0 z-0"></div>

            <!-- 右上角 HUD 看板 -->
            <div class="absolute top-5 left-5 z-20 flex flex-col gap-4 pointer-events-none">
                <div class="glass-panel rounded-xl p-4 w-[260px] pointer-events-auto {{HUD_COLOR_CLASS}} border-l-4 flex flex-col gap-2">
                    <h4 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">实时系统物理传感器</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                            <span class="text-slate-500 block text-[9px]">输入自变量 X</span>
                            <span id="hud-var1" class="font-semibold text-slate-200">1.00</span>
                        </div>
                        <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                            <span class="text-slate-500 block text-[9px]">响应速度 V</span>
                            <span id="hud-var2" class="font-semibold text-slate-200">0.00</span>
                        </div>
                    </div>
                    <div class="bg-slate-900/50 p-2 rounded border border-white/5 flex justify-between items-center text-xs">
                        <span class="text-slate-500 text-[9px]">系统总能量 (E)</span>
                        <span id="hud-energy" class="font-bold text-[{{SUBJECT_COLOR}}]">0.00</span>
                    </div>
                </div>
            </div>

            <!-- 右侧绘图面板 -->
            <div class="absolute top-5 right-5 z-20 flex flex-col gap-4 pointer-events-none w-[300px]">
                <div class="glass-panel rounded-xl p-4 pointer-events-auto border-t-2 border-t-[{{SUBJECT_COLOR}}] flex flex-col gap-2">
                    <h4 class="text-xs font-semibold text-[{{SUBJECT_COLOR}}] flex items-center justify-between">
                        <span>📈 实移动能波动走势</span>
                        <span class="text-[9px] text-slate-500">SVG 采样</span>
                    </h4>
                    <div class="h-[120px] bg-slate-950/70 rounded-lg relative border border-white/5">
                        <svg id="svg-vt-chart" class="w-full h-full"></svg>
                    </div>
                </div>
            </div>

            <!-- 底部滑动调整器 -->
            <div class="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap gap-6 items-center justify-between glass-panel rounded-2xl p-5 border border-white/5">
                <!-- 核心参数1 -->
                <div class="flex-1 flex gap-6 items-center px-2 min-w-[400px]">
                    <div class="flex-1 flex flex-col gap-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-300 font-semibold">🔴 控制因子 (A)</span>
                            <span id="val-slider1" class="font-mono text-[{{SUBJECT_COLOR}}]">1.50</span>
                        </div>
                        <input id="slider-1" type="range" min="0.1" max="5.0" step="0.05" value="1.5" class="custom-slider">
                    </div>
                    
                    <div class="flex-1 flex flex-col gap-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-300 font-semibold">🟢 阻尼常数 (k)</span>
                            <span id="val-slider2" class="font-mono text-[{{SUBJECT_COLOR}}]">0.08</span>
                        </div>
                        <input id="slider-2" type="range" min="0.0" max="0.5" step="0.01" value="0.08" class="custom-slider">
                    </div>
                </div>

                <!-- 倍率 -->
                <div class="flex items-center gap-2">
                    <select id="select-speed" class="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-[{{SUBJECT_COLOR}}] transition-colors">
                        <option value="0.5">0.5x 慢速</option>
                        <option value="1.0" selected>1.0x 正常</option>
                        <option value="2.0">2.0x 快速</option>
                    </select>
                </div>
            </div>

            <!-- 可折叠小测验面板 -->
            <div id="quiz-panel" class="absolute bottom-32 right-5 z-30 w-[340px] glass-panel rounded-2xl overflow-hidden flex flex-col">
                <div class="h-10 border-b border-white/5 bg-slate-900/90 px-4 flex items-center justify-between">
                    <span class="text-xs font-semibold text-[{{SUBJECT_COLOR}}]">⚡ 互动诊断小测验</span>
                    <button id="btn-quiz-close" class="text-slate-400 hover:text-white text-xs">✕</button>
                </div>
                
                <div id="quiz-content" class="p-4 flex flex-col gap-3 text-xs">
                    <div class="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                        <span id="quiz-question-num" class="text-[9px] text-[{{SUBJECT_COLOR}}] uppercase block mb-1">问题 1 of 3</span>
                        <p id="quiz-question" class="text-slate-200 font-medium leading-relaxed"></p>
                    </div>
                    <div id="quiz-options" class="flex flex-col gap-2"></div>
                    <div id="quiz-feedback" class="hidden p-2.5 rounded-lg border text-[11px] leading-relaxed transition-all"></div>
                </div>
            </div>
        </div>
    </main>

    <!-- Three.js -->
    [[SCRIPT_THREE]]

    <!-- JS Core Logic -->
    [[SCRIPT_MAIN_LOGIC]]
</body>
</html>
    ` };
        }
        return { textContent: '', style: {}, classList: { add:()=>{}, remove:()=>{} } };
    }
};


        // 全局状态管理
        const AppState = {
            currentSubject: '物理',    // 当前所选学科
            generatedCode: '',        // 当前生成的网页 HTML 源码
            generatedTitle: '',       // 当前生成的标题
            generatedSubject: '',     // 当前生成的学科
            isCurrentSaved: false,     // 当前生成是否已保存
            history: []               // 历史生成记录 {id, title, subject, time, html}
        };

        // 页面初始化
        window.addEventListener('DOMContentLoaded', () => {
            initSubjectStyles();
            loadHistoryFromStorage();
        });

        // ==========================================
        // 1. 学科选择与交互
        // ==========================================
        
        function initSubjectStyles() {
            selectSubject('物理');
        }

        function selectSubject(subjectName) {
            AppState.currentSubject = subjectName;

            const buttons = document.querySelectorAll('.subject-btn');
            buttons.forEach(btn => {
                const textSpan = btn.querySelector('.font-bold').textContent;
                const isSelected = textSpan.includes(subjectName);

                if (isSelected) {
                    btn.className = btn.className.replace(/border-slate-800 bg-slate-900\/60/g, 'border-cyan-500 bg-cyan-500/10');
                    btn.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.15)';
                } else {
                    btn.className = btn.className.replace(/border-cyan-500 bg-cyan-500\/10/g, 'border-slate-800 bg-slate-900/60');
                    btn.style.boxShadow = 'none';
                }
            });
        }

        function fillPrompt(text, subject) {
            document.getElementById('prompt-input').value = text;
            selectSubject(subject);
        }

        // ==========================================
        // 2. 模拟 AI 核心生成流程
        // ==========================================

        const AI_LOG_ASSETS = {
            '物理': [
                '识别核心物理主题。成功匹配粒子系统渲染模式。',
                '初始化 Three.js (r134) WebGL 物理渲染环境...',
                '构建 3D 三维刚性边界及弹性碰撞反弹轨道模型...',
                '注入经典力学常微分方程与 Euler 时间积分插值算法...',
                '建立三维空间受力矢量指示箭头系统 (Force / Friction / Acceleration)...',
                '绘制 SVG (v-t) 速度-时间、(a-t) 加速度-时间实时二维波动图表...',
                '绑定物理参数控制器：可调控重力加速度、质量块与阻尼摩擦力系数...',
                '设计并注入三阶段针对力学概念的选择题测验库！',
                '完成优化！注入硬件 60fps 双缓冲渲染，场景就绪。'
            ],
            '化学': [
                '识别化学微观主题。成功匹配分子键立体原子渲染模式。',
                '初始化 Three.js 3D 微观世界，加载原子材质和轨道晕圈...',
                '基于弹性键模型生成分子间共价键及电子云运动轨迹...',
                '绘制化学反应前后系统热力学焓变 (ΔH) SVG 二维能量走势曲线...',
                '装配微观数据HUD：分子量、化学键角、电子排布实时统计板...',
                '生成核心化学方程式 $A + B \\rightarrow C + D$ 精美 KaTeX 格式...',
                '添加滑块控制器：可调控环境温度、反应物摩尔浓度及催化剂活性因子...',
                '设计化学元素周期及能量跃迁互动知识小测验！',
                '完成反应模拟装配！开启各向同性抗锯齿材质渲染。'
            ],
            '生物': [
                '识别生物生命科学主题。成功匹配有机多维双螺旋粒子模型。',
                '搭建 Three.js 3D 有机流体大分子渲染环境，配置环境散焦光晕...',
                '利用螺旋拓扑方程构建高分子 DNA 遗传链，模拟解旋与配对过程...',
                '建立多通道微动交互：支持碱基序列随机突变与蛋白质链实时折叠...',
                '绘制系统环境生物质能转化及系统熵增 SVG 状态统计图...',
                '配置微粒传感器HUD：胞内浓度、突变频率、复制速率看板...',
                '编写生物学特征比喻与生动的高中-大学原理讲解面板...',
                '针对大分子复制与微观遗传机制装配自适应诊断测验！',
                '渲染就绪！平滑骨骼蒙皮动画编译成功，粒子激活。'
            ],
            '数学': [
                '识别抽象数学定理。成功匹配高维几何与代数函数渲染模式。',
                '初始化几何证明坐标系。配置 SVG 交互画布及矢量图形生成器...',
                '构建 3D 多面体展开或三维正弦叠加几何体模型...',
                '编译几何割补法、代数化简动态矢量演示路径...',
                '实时解算数学公式表达式，生成精致 KaTeX 数学公式面板...',
                '绘制多重函数自变量因变量变动 SVG 直角坐标图表...',
                '绑定变量控制器：可连续调节频率、相位、比例与维度数...',
                '开发几何概念及公式证明三阶段互动诊断小题库！',
                '数学证明场景装配完毕！2D/3D 同步更新器启动。'
            ],
            '天文': [
                '识别天体物理主题。成功匹配行星引力轨道渲染模式。',
                '构建 Three.js 3D 宏观宇宙引力场，启用全景星空盒与星云粒子...',
                '引入牛顿万有引力与开普勒轨道积分计算系统...',
                '渲染行星日食月食阴影投射或黑洞光路引力红移引力透镜效果...',
                '绘制行星偏心率、线速度与向心力 SVG 关系走势大图...',
                '设置宏观星系 HUD：质量比、引力常数 G、相对速度监测...',
                '装配天体力学、光谱分析与红移公式等 KaTeX 科学推导...',
                '整合天体物理与宇宙学前沿知识互动测验试题！',
                '编译完成！启用 1024 阶高精度阴影贴图，宇宙沙盒就绪。'
            ],
            '综合': [
                '识别前沿信息技术主题。成功匹配神经网络/拓扑网格粒子模式。',
                '初始化 Three.js 多层拓扑图结构神经元渲染器...',
                '绘制数据节点前向传播与反向求导粒子流动立体连线...',
                '实时绘制网络误差曲线、信息熵与复杂度 SVG 分析图表...',
                '建立信息矩阵 HUD 看板：层数、权值分布、激活函数状态...',
                '编译算法复杂度推导 KaTeX 精准公式：$O(N \\log N)$ 样式...',
                '绑定参数控制器：可调控网络层数、学习率、数据集复杂程度...',
                '编写机器学习和信息工程前沿互动式选择小测验！',
                '编译完成！神经网络与拓扑流动沙盒初始化完成。'
            ]
        };

        function startVisualGeneration() {
            const prompt = document.getElementById('prompt-input').value.trim();
            if (!prompt) {
                alert('请先输入教学主题提示词！');
                return;
            }

            // 1. 切换页面至生成中
            document.getElementById('panel-generator').classList.add('hidden');
            document.getElementById('bg-decoration').classList.add('opacity-10');
            document.getElementById('panel-generating').classList.remove('hidden');

            const consolePanel = document.getElementById('console-logs');
            consolePanel.innerHTML = '';
            const progressbar = document.getElementById('gen-progressbar');
            progressbar.style.width = '5%';
            document.getElementById('gen-status-text').textContent = '[System] 正在初始化神经编译管道...';

            const subject = AppState.currentSubject;
            const logs = AI_LOG_ASSETS[subject] || AI_LOG_ASSETS['综合'];
            let currentLogIndex = 0;

            const totalSteps = logs.length;
            const stepInterval = 280;

            const intervalId = setInterval(() => {
                if (currentLogIndex < totalSteps) {
                    const logText = logs[currentLogIndex];
                    const progressPercent = Math.min(95, Math.floor(((currentLogIndex + 1) / totalSteps) * 100));
                    
                    const logElement = document.createElement('div');
                    logElement.className = 'fade-in flex gap-2';
                    
                    let icon = '⚡';
                    let color = 'text-cyan-500';
                    if (logText.includes('编译') || logText.includes('初始化')) {
                        icon = '⚙️';
                        color = 'text-indigo-400';
                    } else if (logText.includes('公式') || logText.includes('方程')) {
                        icon = '📝';
                        color = 'text-amber-400';
                    } else if (logText.includes('测验')) {
                        icon = '⚡';
                        color = 'text-purple-400';
                    } else if (logText.includes('完成') || logText.includes('就绪')) {
                        icon = '✅';
                        color = 'text-emerald-400';
                    }

                    logElement.innerHTML = `<span class="${color}">${icon}</span> <span class="text-slate-300 font-medium">${logText}</span>`;
                    consolePanel.appendChild(logElement);
                    consolePanel.scrollTop = consolePanel.scrollHeight;

                    progressbar.style.width = `${progressPercent}%`;
                    document.getElementById('gen-status-text').textContent = `[AI Analyzer] ${logText.substring(0, 15)}...`;

                    currentLogIndex++;
                } else {
                    clearInterval(intervalId);
                    
                    setTimeout(() => {
                        progressbar.style.width = '100%';
                        document.getElementById('gen-status-text').textContent = '✅ 生成完毕！正在加载 iframe 可视化...';
                        
                        setTimeout(() => {
                            try {
                                const generatedData = assembleHTMLPage(prompt, subject);
                                
                                AppState.generatedCode = generatedData.html;
                                AppState.generatedTitle = generatedData.title;
                                AppState.generatedSubject = generatedData.subject;
                                AppState.isCurrentSaved = false;

                                document.getElementById('preview-title').textContent = generatedData.title;
                                document.getElementById('preview-subtitle').textContent = `学科方向：${generatedData.subject} 级可视化探索`;

                                const saveBtn = document.getElementById('btn-save-history');
                                saveBtn.disabled = false;
                                saveBtn.innerHTML = `<span>💾 保存课程至历史</span>`;
                                saveBtn.className = saveBtn.className.replace(/from-slate-700 to-slate-800/g, 'from-emerald-500 to-teal-500');
                                saveBtn.className = saveBtn.className.replace(/text-slate-400/g, 'text-slate-950');

                                const iframe = document.getElementById('preview-iframe');
                                const blob = new Blob([AppState.generatedCode], { type: 'text/html;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                iframe.src = url;

                                document.getElementById('panel-generating').classList.add('hidden');
                                document.getElementById('panel-preview').classList.remove('hidden');
                            } catch (err) {
                                console.error('生成器内部出现异常错误：', err);
                                alert('AI 引擎生成页面异常，请检查控制台错误日志！\\n' + err.message);
                                showGeneratorPanel();
                            }
                        }, 500);
                    }, 400);
                }
            }, stepInterval);
        }

        // ==========================================
        // 3. 核心功能：前端 HTML 代码拼装引擎
        // ==========================================
        
        function stringToHash(str) {
            let hash = 0;
            if (str.length === 0) return hash;
            for (let i = 0; i < str.length; i++) {
                const chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; 
            }
            return Math.abs(hash);
        }

        function assembleHTMLPage(promptTitle, subjectName) {
            const cleanTitle = promptTitle.trim();
            const hashVal = stringToHash(cleanTitle);
            const varIdx = hashVal % 3; 
            
            let subjectColor = '#22D3EE'; 
            let colorGradient = 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #22D3EE 100%)';
            let bgGradient = 'linear-gradient(180deg, #0F172A 0%, #0B1E26 60%, #082F3E 100%)';
            let hudColorClass = 'border-l-cyan-400';
            
            if (subjectName === '物理') {
                if (varIdx === 0) {
                    subjectColor = '#22D3EE'; 
                    colorGradient = 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #22D3EE 100%)';
                    bgGradient = 'linear-gradient(180deg, #0F172A 0%, #0B1E26 60%, #082F3E 100%)';
                    hudColorClass = 'border-l-cyan-400';
                } else if (varIdx === 1) {
                    subjectColor = '#F43F5E'; 
                    colorGradient = 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #F43F5E 100%)';
                    bgGradient = 'linear-gradient(180deg, #1C0A0E 0%, #310D16 60%, #4C0519 100%)';
                    hudColorClass = 'border-l-rose-400';
                } else {
                    subjectColor = '#3B82F6'; 
                    colorGradient = 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)';
                    bgGradient = 'linear-gradient(180deg, #0A0F1E 0%, #0D1B3E 60%, #0E255F 100%)';
                    hudColorClass = 'border-l-blue-400';
                }
            } else if (subjectName === '化学') {
                if (varIdx === 0) {
                    subjectColor = '#34D399'; 
                    colorGradient = 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)';
                    bgGradient = 'linear-gradient(180deg, #070F0C 0%, #081C14 60%, #022B1E 100%)';
                    hudColorClass = 'border-l-emerald-400';
                } else if (varIdx === 1) {
                    subjectColor = '#10B981'; 
                    colorGradient = 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)';
                    bgGradient = 'linear-gradient(180deg, #050E0A 0%, #0C2117 60%, #063923 100%)';
                    hudColorClass = 'border-l-teal-400';
                } else {
                    subjectColor = '#A7F3D0'; 
                    colorGradient = 'linear-gradient(135deg, #065F46 0%, #047857 50%, #6EE7B7 100%)';
                    bgGradient = 'linear-gradient(180deg, #040A07 0%, #092015 60%, #0F3A26 100%)';
                    hudColorClass = 'border-l-emerald-200';
                }
            } else if (subjectName === '生物') {
                if (varIdx === 0) {
                    subjectColor = '#F97316'; 
                    colorGradient = 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)';
                    bgGradient = 'linear-gradient(180deg, #0F0B09 0%, #211209 60%, #3B1B0E 100%)';
                    hudColorClass = 'border-l-orange-400';
                } else if (varIdx === 1) {
                    subjectColor = '#EF4444'; 
                    colorGradient = 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)';
                    bgGradient = 'linear-gradient(180deg, #140808 0%, #290F0F 60%, #450E0E 100%)';
                    hudColorClass = 'border-l-red-400';
                } else {
                    subjectColor = '#F59E0B'; 
                    colorGradient = 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)';
                    bgGradient = 'linear-gradient(180deg, #120E05 0%, #251B08 60%, #3D2B09 100%)';
                    hudColorClass = 'border-l-amber-400';
                }
            } else if (subjectName === '数学') {
                if (varIdx === 0) {
                    subjectColor = '#FBBF24'; 
                    colorGradient = 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)';
                    bgGradient = 'linear-gradient(180deg, #0F100A 0%, #1F1E0C 60%, #302E09 100%)';
                    hudColorClass = 'border-l-amber-400';
                } else if (varIdx === 1) {
                    subjectColor = '#84CC16'; 
                    colorGradient = 'linear-gradient(135deg, #4D7C0F 0%, #65A30D 50%, #84CC16 100%)';
                    bgGradient = 'linear-gradient(180deg, #090B05 0%, #141B0A 60%, #202E0E 100%)';
                    hudColorClass = 'border-l-lime-400';
                } else {
                    subjectColor = '#10B981'; 
                    colorGradient = 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)';
                    bgGradient = 'linear-gradient(180deg, #040906 0%, #0B1E13 60%, #10321F 100%)';
                    hudColorClass = 'border-l-emerald-400';
                }
            } else if (subjectName === '天文') {
                if (varIdx === 0) {
                    subjectColor = '#8B5CF6'; 
                    colorGradient = 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #A78BFA 100%)';
                    bgGradient = 'linear-gradient(180deg, #0B0A12 0%, #120D26 60%, #1D0F40 100%)';
                    hudColorClass = 'border-l-purple-400';
                } else if (varIdx === 1) {
                    subjectColor = '#EC4899'; 
                    colorGradient = 'linear-gradient(135deg, #C2185B 0%, #E91E63 50%, #F48FB1 100%)';
                    bgGradient = 'linear-gradient(180deg, #0F080C 0%, #240C1A 60%, #3C0A29 100%)';
                    hudColorClass = 'border-l-pink-400';
                } else {
                    subjectColor = '#6366F1'; 
                    colorGradient = 'linear-gradient(135deg, #4338CA 0%, #4F46E5 50%, #818CF8 100%)';
                    bgGradient = 'linear-gradient(180deg, #060714 0%, #0C0F28 60%, #141743 100%)';
                    hudColorClass = 'border-l-indigo-400';
                }
            } else {
                if (varIdx === 0) {
                    subjectColor = '#EC4899'; 
                    colorGradient = 'linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F472B6 100%)';
                    bgGradient = 'linear-gradient(180deg, #0F090E 0%, #210A19 60%, #3B0E2B 100%)';
                    hudColorClass = 'border-l-pink-400';
                } else if (varIdx === 1) {
                    subjectColor = '#A855F7'; 
                    colorGradient = 'linear-gradient(135deg, #7E22CE 0%, #9333EA 50%, #C084FC 100%)';
                    bgGradient = 'linear-gradient(180deg, #0B0712 0%, #170E28 60%, #2D144A 100%)';
                    hudColorClass = 'border-l-purple-300';
                } else {
                    subjectColor = '#06B6D4'; 
                    colorGradient = 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)';
                    bgGradient = 'linear-gradient(180deg, #040B12 0%, #091D2E 60%, #083354 100%)';
                    hudColorClass = 'border-l-cyan-300';
                }
            }

            let meta = generateTopicDetails(cleanTitle, subjectName);

            let template = document.getElementById('course-template').textContent;
            
            let html = template
                .replaceAll('{{TITLE}}', () => cleanTitle)
                .replaceAll('{{SUBJECT}}', () => subjectName)
                .replaceAll('{{SUBJECT_COLOR}}', () => subjectColor)
                .replaceAll('{{COLOR_GRADIENT}}', () => colorGradient)
                .replaceAll('{{BG_GRADIENT}}', () => bgGradient)
                .replaceAll('{{HUD_COLOR_CLASS}}', () => hudColorClass)
                .replaceAll('{{FORMULA}}', () => meta.formula)
                .replaceAll('{{SYMBOLS}}', () => meta.symbols)
                .replaceAll('{{METAPHOR}}', () => meta.metaphor)
                .replaceAll('{{PRINCIPLE}}', () => meta.principle)
                .replaceAll('{{QUIZ_DATA}}', () => JSON.stringify(meta.quizzes));
                
            // 采用拼接方式注入子页面脚本和主 JS 动力学逻辑，彻底打通 iframe 通路
            html = html
                .replaceAll('[[SCRIPT_TAILWIND]]', () => '<script src="https://cdn.tailwindcss.com"></' + 'script>')
                .replaceAll('[[SCRIPT_TAILWIND_CONFIG]]', () => '<script>tailwind.config={theme:{extend:{colors:{theme:{accent:\'' + subjectColor + '\'}}}}}</' + 'script>')
                .replaceAll('[[SCRIPT_KATEX_JS]]', () => '<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></' + 'script>')
                .replaceAll('[[SCRIPT_KATEX_AUTO_RENDER]]', () => '<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></' + 'script>')
                .replaceAll('[[SCRIPT_THREE]]', () => '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></' + 'script>')
                .replaceAll('[[SCRIPT_MAIN_LOGIC]]', () => '<script>' + assembleSubPageScript(cleanTitle, subjectName, subjectColor, meta.quizzes, meta.formula, hashVal) + '</' + 'script>');
                
            return {
                html: html,
                title: cleanTitle,
                subject: subjectName
            };
        }

        // ==========================================
        // 4. 辅助模块：根据输入主题动态生成课程详细元数据
        // ==========================================

        function generateTopicDetails(title, subject) {
            let formula = 'y = f(x)';
            let symbols = 'x - 自变量，y - 响应变动值';
            let principle = '当外在的扰动激发系统时，【' + title + '】系统的微观粒子便开始发生状态迁移，最终在控制因子约束下趋向于动力学平衡稳态。';
            let metaphor = '研究【' + title + '】就像在风平浪静的湖面上丢下一颗石子，激起的水波一圈圈向外扩散，其振幅和能量随传播距离而发生平滑衰减。';
            let quizzes = [
                {
                    question: '在对【' + title + '】的动力学研究中，最核心的决定因子是？',
                    options: ['A) 环境的外在强迫力', 'B) 微观质点的本征属性', 'C) 二者在特定边界下的动态耦合平衡'],
                    correct: 2,
                    explanation: '本模型生动展现的不仅是单纯的作用，而是【' + title + '】系统受外力反馈后逐步建立的自适应动态稳态。'
                },
                {
                    question: '如果我们将控制参数滑块调至最大极值，系统粒子更倾向于？',
                    options: ['A) 运动速率呈线性均匀发散', 'B) 物理能量急剧发散产生高频相变', 'C) 系统运动彻底停滞归零'],
                    correct: 1,
                    explanation: '高控制率会给系统粒子注入更高的动能，导致其能量波动走势图上呈现极高振幅的大波动变化。'
                },
                {
                    question: '日常生活中，以下哪种自然机制与该原理最为接近？',
                    options: ['A) 沸水在室温下自然冷却至平衡', 'B) 自由下落物体的匀加速漂移', 'C) 密闭空间内气味的扩散'],
                    correct: 0,
                    explanation: '热水冷却是一个典型的在阻尼和热传导下，系统与外界发生耦合、能量呈指数级递减直至稳态的物理体现。'
                }
            ];

            if (subject === '物理') {
                if (title.includes('双摆') || title.includes('摆')) {
                    formula = '\\begin{cases} (m_1+m_2)l_1\\ddot{\\theta}_1 + m_2l_2\\ddot{\\theta}_2\\cos(\\theta_1-\\theta_2) + m_2l_2\\dot{\\theta}_2^2\\sin(\\theta_1-\\theta_2) + (m_1+m_2)g\\sin\\theta_1 = 0 \\\\ l_2\\ddot{\\theta}_2 + l_1\\ddot{\\theta}_1\\cos(\\theta_1-\\theta_2) - l_1\\dot{\\theta}_1^2\\sin(\\theta_1-\\theta_2) + g\\sin\\theta_2 = 0 \\end{cases}';
                    symbols = '\theta_1, \theta_2 - 两个摆臂的偏角；l_1, l_2 - 摆臂长度；m_1, m_2 - 摆锤质量';
                    principle = '双摆是一个经典的混沌动力学系统。虽然其受重力掌控，由于两个摆臂在运动中时刻传递能量，其最终运动路径对初始值极其敏感，不可被预测。';
                    metaphor = '设计比喻：就像两只手拉手跳华尔兹的舞者，一个人突然绊了一下，整段双人舞的舞步都会变得毫无规律且不可预测。';
                    quizzes = [
                        {
                            question: '为什么双摆被称为“混沌系统”？',
                            options: ['A) 因为它的运动彻底不受牛顿力学控制', 'B) 因为它对初始条件极其敏感，微分方程没有解析解', 'C) 它是绝对静止不动的'],
                            correct: 1,
                            explanation: '混沌的精髓就在于“确定性系统却产生不可预测的结果”，初始位置差之毫厘，最终轨迹失之千里！'
                        },
                        {
                            question: '如果我们完全调零阻尼常数 (k)，双摆最终会？',
                            options: ['A) 瞬间静止', 'B) 永无止境地以极其混乱的轨迹摆动下去', 'C) 转为规则的正弦往复运动'],
                            correct: 1,
                            explanation: '没有阻力做负功耗散能量，系统总机械能守恒，它将永远保持复杂的混沌运动。'
                        }
                    ];
                } else if (title.includes('电磁') || title.includes('磁')) {
                    formula = '\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t}';
                    symbols = '\text{EMF} - 感应电动势；N - 线圈匝数；\Delta \Phi_B/\Delta t - 磁通量变化率';
                    principle = '法拉第电磁感应定律指出，穿过闭合回路的磁通量发生改变时，回路中会产生感应电动势。磁铁移动的速率越大，感应电流就越大。';
                    metaphor = '磁铁线圈像一对“口是心非”的情侣。磁铁靠近时，线圈排斥它；磁铁想离开时，线圈反而拉住它。这种“傲娇”也就是楞次定律（感应电流阻碍相对运动）。';
                    quizzes = [
                        {
                            question: '在磁铁往复穿过线圈时，产生感应电动势最大的一瞬是？',
                            options: ['A) 磁铁静止在线圈正中央时', 'B) 磁铁速度最快力越过线圈边缘时', 'C) 磁铁拿走距离最远时'],
                            correct: 1,
                            explanation: '根据公式，感应电动势正比于磁通量“变化率”。速度最快时磁通量变动最剧烈，所以电压输出最高！'
                        },
                        {
                            question: '增大滑动滑块中的“线圈匝数 (N)”，感应电流会？',
                            options: ['A) 线性增加', 'B) 归零', 'C) 减小'],
                            correct: 0,
                            explanation: '根据法拉第定律，电动势与线圈匝数 N 成正比，匝数越多，多匝线圈累加的电动势也就越大。'
                        }
                    ];
                } else if (title.includes('声波') || title.includes('共振') || title.includes('振动') || title.includes('声')) {
                    formula = '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u';
                    symbols = 'u - 介质质点的局部弹性位移量；t - 时间；c - 声波在该介质中的传播速率';
                    principle = '声波是机械振动在弹性介质中的传播。当声源发生周期性简谐运动时，空气微粒在其平衡位置附近往复运动，将动能递次传递，在空间中形成疏密相间的弹性波。';
                    metaphor = '就像一群排队买票的观众。后面的人推了前面人一下，这个“推动”的动作（能量）就会像波浪一样在人群中迅速向前传递，但每个人其实并没有真的走下台阶。';
                    quizzes = [
                        {
                            question: '在当前模拟的声波共振中，空气微粒的运动轨迹是？',
                            options: ['A) 随声波传播方向做持续的定向匀速漂移', 'B) 在其平衡位置附近进行局部的简谐振动', 'C) 彻底保持静止不动'],
                            correct: 1,
                            explanation: '声波传递的是机械波能量与动量，介质微粒本身只在平衡位置附近作简谐往复，并不随波漂走。'
                        },
                        {
                            question: '调高滑块中的“控制因子 (A)”即增大振源频率，声波的波长将？',
                            options: ['A) 随频率增加而线性变长', 'B) 显著变短', 'C) 保持完全不变'],
                            correct: 1,
                            explanation: '声速一定时，波长与频率成反比。频率（A）越高，波长就越短，微粒分布的波峰波谷就越紧密！'
                        }
                    ];
                } else if (title.includes('热') || title.includes('分子') || title.includes('温度') || title.includes('碰撞') || title.includes('气体')) {
                    formula = 'f(v) = 4\\pi \\left( \\frac{m}{2\\pi kT} \\right)^{3/2} v^2 e^{-\\frac{mv^2}{2kT}}';
                    symbols = 'v - 微粒运动速率；m - 单个分子质量；T - 系统绝对温度；k - 玻尔兹曼常数';
                    principle = '麦克斯韦-玻尔兹曼速率分布描述了热力学平衡状态下理想气体分子的热运动速率分布。温度是系统微观质点无规则撞击平均动能的宏观表征。';
                    metaphor = '就像一个装满疯狂弹力球的密闭大箱子。球与球之间、球与箱壁之间不停碰撞。当我们给箱子加热（提高温度滑块），里面的弹力球就会像吃了兴奋剂一样，碰撞速度与频率成倍飙升。';
                    quizzes = [
                        {
                            question: '如果我们拉大滑块中的“温度（A）”，微粒之间的碰撞频率与速率会？',
                            options: ['A) 指数级递减', 'B) 显著加快并变得更剧烈', 'C) 瞬间冷却至绝对零度'],
                            correct: 1,
                            explanation: '绝对温度 T 越高，分子的最概然速率就越大，碰撞更加频繁剧烈，系统总能量大增。'
                        }
                    ];
                } else {
                    formula = 'F_{net} = m \\cdot a';
                    symbols = 'F - 合外力；m - 质量；a - 产生的物理加速度';
                    principle = '经典力学基石。物体的加速度与合外力成正比，与质量成反比。当外力突破阻尼摩擦力极限时，粒子群开始发生动力学定向漂移。';
                    metaphor = '推一辆装满石头的购物车。车里石头（质量）越多，你推它起步（加速度）就越费劲；如果地面生锈（阻力），你就必须用更大的力。';
                }
            }
            else if (subject === '生物') {
                if (title.includes('DNA') || title.includes('分子') || title.includes('复制') || title.includes('螺旋')) {
                    formula = 'N = N_0 \\cdot 2^n';
                    symbols = 'N - 复制后得到的 DNA 链总数；N_0 - 初始链数；n - 复制世代循环数';
                    principle = 'DNA 半保留复制是生命繁衍的基石。在解旋酶的作用下，双链氢键断开解开成为单链，游离的脱氧核苷酸碱基（A-T, G-C）互补配对，形成两个子代 DNA 分子。';
                    metaphor = '拉开拉链，左右两条拉链齿分别作为模板。我们从首饰盒里拿出一组配对纽扣，根据原本拉链齿 of 凹凸（碱基互补），扣在两侧，做成了两条一模一样的拉链。';
                    quizzes = [
                        {
                            question: 'DNA 复制之所以被称为“半保留复制”，主要是因为？',
                            options: ['A) 只复制了原链的一半碱基', 'B) 子代双螺旋中包含一条来自亲代的老链 and 一条新合成的子链', 'C) 复制后老链被分解了'],
                            correct: 1,
                            explanation: '这保证了遗传信息的高度稳定性！每一条双螺旋中都牢靠地保留了一半的亲代母版序列。'
                        },
                        {
                            question: '在 3D 界面中增加“碱基突变率”控制滑块，会导致？',
                            options: ['A) 复制彻底停滞', 'B) 局部核苷酸配对失误，产生遗传密码的随机变异', 'C) 画面发生错乱'],
                            correct: 1,
                            explanation: '高突变率模拟了物理或化学诱变因子干扰，导致 A 没能配对 T，形成了碱基对的基因突变！'
                        }
                    ];
                } else {
                    formula = '6CO_2 + 12H_2O \\xrightarrow[叶绿体]{光能} C_6H_{12}O_6 + 6O_2 + 6H_2O';
                    symbols = 'CO_2 - 二氧化碳；H_2O - 水；C_6H_{12}O_6 - 葡萄糖；O_2 - 氧气';
                    principle = '【' + title + '】过程完美展现了生物圈的能量转化。叶绿体中利用光能将无机物二氧化碳和水合成为有机物葡萄糖并释放氧气，是地球生命之源。';
                    metaphor = '叶绿体就像微型的太阳能电池板和有机面包房。吸收阳光转化成电力，接着将面粉（二氧化碳 and 水）精细烘焙出富含能量的甜美甜点（葡萄糖）。';
                }
            }
            else if (subject === '数学') {
                if (title.includes('勾股') || title.includes('定理') || title.includes('几何')) {
                    formula = 'a^2 + b^2 = c^2';
                    symbols = 'a, b - 直角三角形两个直角边长；c - 斜边长度';
                    principle = '勾股定理是欧氏几何中最基础且辉煌的定理。通过几何图形的割补重组，可以将以直角边为边长的两个正方形的总面积完美折叠转化到斜边正方形的面积上。';
                    metaphor = '就像把两个小玻璃罐里盛满的七彩果汁（直角边面积），倒进大玻璃罐中（斜边面积），不多不少，刚好把大罐子填得一滴不剩。';
                    quizzes = [
                        {
                            question: '勾股定理在西方数学史中被称为？',
                            options: ['A) 毕达哥拉斯定理', 'B) 欧几里得第五公设', 'C) 费马大定理'],
                            correct: 0,
                            explanation: '相传毕达哥拉斯发现该定理后宰杀了一百头牛进行庆祝，故又被亲切地叫做“百牛定理”。'
                        },
                        {
                            question: '如果直角边 a = 3, b = 4，根据定理，斜边 c 等于多少？',
                            options: ['A) 5', 'B) 7', 'C) 25'],
                            correct: 0,
                            explanation: '根据 3 的平方是 9，4 的平方是 16，相加得 25，25 开放就是斜边长度 5！'
                        }
                    ];
                } else if (title.includes('斐波那契') || title.includes('螺旋') || title.includes('黄金') || title.includes('对数')) {
                    formula = 'r = a \\cdot e^{b \\theta}';
                    symbols = 'r - 螺旋线极径；\\theta - 极角；a, b - 螺旋初始尺寸及弯曲扩张常数';
                    principle = '【' + title + '】展现出大自然的自相似性与黄金比例之美。在极坐标系下，对数螺旋线（等角螺旋）沿角度指数级伸展，无论放大多少倍，其局域轮廓比例始终守恒。';
                    metaphor = '就像一个永远按固定比例匀速长大的海螺壳。无论它长大多少倍，它弯曲的弧度和花纹比例永远和它小时候一模一样，具有神奇的自相似结构。';
                    quizzes = [
                        {
                            question: '对数螺旋线（黄金螺旋）在几何学上最显著的特性是？',
                            options: ['A) 它是一条会自身闭合的椭圆轨道', 'B) 具有各向自相似性（等角螺旋）', 'C) 其曲率半径随着极角增大而变小'],
                            correct: 1,
                            explanation: '自相似性是分形与等角螺旋的至美之处，银河系旋臂与贝壳螺纹均是如此。'
                        }
                    ];
                } else {
                    formula = 'f(x) = A \\sin(\\omega x + \\phi)';
                    symbols = 'A - 振幅；\omega - 角频率；\phi - 初始相位';
                    principle = '正弦波是波动的灵魂。任何复杂的周期函数或几何形状，都可以通过傅里叶变换展开为无穷个正弦函数的代数相加叠加。';
                    metaphor = '像心电图的跳动，又像海浪的波谷与波峰。振幅是海浪有多高，频率是海浪拍击沙滩有多快。';
                }
            }
            else if (subject === '天文') {
                if (title.includes('红移') || title.includes('黑洞') || title.includes('引力') || title.includes('宇宙') || title.includes('公转') || title.includes('自转')) {
                    if (title.includes('黑洞') || title.includes('视界') || title.includes('吸积')) {
                        formula = 'R_s = \\frac{2GM}{c^2}';
                        symbols = 'R_s - 史瓦西黑洞事件视界半径；G - 万有引力常数；M - 中心奇点质量；c - 光速';
                        principle = '当超大质量天体在重力作用下无限坍缩时，其引力场极度扭曲时空。事件视界是连光也无法逃逸的最终界面，吸积的物质在视界外摩擦释放高能辐射形成吸积盘。';
                        metaphor = '就像一个宇宙深处的深水超级大漩涡。水池中央有一个无底洞，落入的水流被巨大的重力撕裂，在洞口周围急速打转摩擦，形成了一圈极其耀眼的发光白色浪花（吸积盘）。';
                        quizzes = [
                            {
                                question: '为什么连光也无法逃脱黑洞“事件视界”内部？',
                                options: ['A) 视界内根本不存在任何光子', 'B) 视界内的时空弯曲导致逃逸速度超越了光速极限', 'C) 视界内部充斥着巨大的静电斥力'],
                                correct: 1,
                                explanation: '爱因斯坦引力场方程指出，奇点将空间极度弯曲，所有视界内的光锥全部倾斜指向中心，连光速也只能往奇点坠落。'
                            }
                        ];
                    } else {
                        formula = '1 + z = \\frac{1}{\\sqrt{1 - \\frac{2GM}{rc^2}}}';
                        symbols = 'z - 引力红移系数；G - 引力常数；M - 星体质量；c - 光速；r - 星体半径';
                        principle = '爱因斯坦广义相对论预言，光子从大质量天体的强引力场逃逸时，为了克服引力做功，其光子能量减弱，导致电磁波频率降低，波长变长，从而光谱发生红移。恒星公转与自转同样受此宏观引力场规约。';
                        metaphor = '光子像一个背着沉重背包艰难爬坡的登山客。山坡（引力场）太陡，当他好不容易爬到山顶时，已经气喘吁吁，身上的能量（波长变长）消散了大半。';
                        quizzes = [
                            {
                                question: '当光源无限靠近黑洞“事件视界”时，外部观察者看到的引力红移将？',
                                options: ['A) 趋向于无限大（波长无限拉长，光变暗直至消失）', 'B) 变成强烈的蓝移', 'C) 保持不变'],
                                correct: 0,
                                explanation: '无限靠近视界时，逃逸所需的引力做功趋于无限。光波长被无限拉长直至彻底变暗，这是光被黑洞封锁的极端体现！'
                            },
                            {
                                question: '在 3D 行星中调节“星体质量 (M)”滑块，外部光线的偏折与红移会？',
                                options: ['A) 变大', 'B) 变小', 'C) 不受任何影响'],
                                correct: 0,
                                explanation: '根据爱因斯坦引力场方程，质量越大，局域空间曲率越剧烈，引力红移效应也就随之越强。'
                            }
                        ];
                    }
                } else {
                    formula = 'F_G = G \\frac{m_1 m_2}{r^2}';
                    symbols = 'F_G - 【' + title + '】系统的万有引力大小；G - 引力常数；m_1, m_2 - 双天体质量；r - 中心点间距';
                    principle = '行星绕恒星运行受万有引力场规约。恒星的巨大质量弯曲了周围的时空，行星在重力的势能井中作向心加速的圆周或椭圆坠落轨道运动。';
                    metaphor = '想象一张蹦紧的蹦床。如果你在中间放一个沉重保龄球（恒星），蹦床会陷下去一个漏斗。你扔出一个小玻璃弹珠，它就会沿着漏斗的坡度永远打转。';
                }
            }

            return {
                formula,
                symbols,
                principle,
                metaphor,
                quizzes
            };
        }

        // ==========================================
        // 5. 子页面内部独立 JS 拼接，安全传参，解决未定义漏洞
        // ==========================================

        function assembleSubPageScript(topic, subject, accentColor, quizzes, formula, hashVal) {
            // 子网页 JS 代码，彻底清除所有会引发转义和闭合冲突的“模板反引号”，全部使用经典、安全的单引号字符拼接！
            return `
        function showVisualError(msg, stack) {
            const errDiv = document.createElement('div');
            errDiv.style.position = 'absolute';
            errDiv.style.inset = '0';
            errDiv.style.zIndex = '99999';
            errDiv.style.background = 'rgba(15, 23, 42, 0.96)';
            errDiv.style.color = '#FB7185';
            errDiv.style.fontFamily = 'monospace';
            errDiv.style.padding = '30px';
            errDiv.style.overflow = 'auto';
            errDiv.style.fontSize = '12px';
            errDiv.style.lineHeight = '1.6';
            errDiv.innerHTML = '<h2 style="font-size:16px;font-weight:bold;color:#FB7185;margin-bottom:15px;border-bottom:1px solid rgba(251,113,133,0.2);padding-bottom:10px;">🚨 运行时动力学引擎崩溃异常</h2><p><b>错误描述：</b>' + msg + '</p><pre style="margin-top:15px;background:rgba(0,0,0,0.4);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">' + (stack || '无可用堆栈') + '</pre>';
            document.body.appendChild(errDiv);
        }

        window.onerror = function(message, source, lineno, colno, error) {
            showVisualError(message + ' (行: ' + lineno + ', 列: ' + colno + ')', error ? error.stack : '');
            return false;
        };

        class MinimalOrbitControls {
            constructor(object, domElement) {
                this.object = object;
                this.domElement = domElement;
                this.target = new THREE.Vector3(0, 0, 0);
                this.spherical = new THREE.Spherical().setFromVector3(this.object.position);
                this.minDistance = 2;
                this.maxDistance = 60;
                
                this.isPointerDown = false;
                this.pointerStart = new THREE.Vector2();
                this.pointerEnd = new THREE.Vector2();
                this.pointerDelta = new THREE.Vector2();

                this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
                this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this), false);
                this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this), false);
                this.domElement.addEventListener('wheel', this.onWheel.bind(this), false);
                this.update();
            }

            onPointerDown(event) {
                this.isPointerDown = true;
                this.pointerStart.set(event.clientX, event.clientY);
            }

            onPointerMove(event) {
                if (!this.isPointerDown) return;
                this.pointerEnd.set(event.clientX, event.clientY);
                this.pointerDelta.subVectors(this.pointerEnd, this.pointerStart).multiplyScalar(0.005);
                
                this.spherical.theta -= this.pointerDelta.x;
                this.spherical.phi -= this.pointerDelta.y;
                this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
                
                this.pointerStart.copy(this.pointerEnd);
                this.update();
            }

            onPointerUp() { this.isPointerDown = false; }

            onWheel(event) {
                event.preventDefault();
                const zoomScale = 1.05;
                if (event.deltaY < 0) { this.spherical.radius /= zoomScale; } else { this.spherical.radius *= zoomScale; }
                this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
                this.update();
            }

            update() {
                this.object.position.setFromSpherical(this.spherical).add(this.target);
                this.object.lookAt(this.target);
            }
        }

        const State = {
            isPlaying: true,
            val1: 1.5,
            val2: 0.08,
            simSpeed: 1.0,
            time: 0,
            history: []
        };

        let scene, camera, renderer, controls;
        let animatedGroup, bgParticles;
        const currentTopic = '${topic}';
        const currentSubject = '${subject}';
        const currentHash = ${hashVal};

        function init3D() {
            const container = document.getElementById('canvas-container');
            const width = container.clientWidth;
            const height = container.clientHeight;

            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x070D19, 0.015);

            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.set(0, 5, 20);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            controls = new MinimalOrbitControls(camera, renderer.domElement);
            
            const ambientLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.6);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
            dirLight.position.set(10, 20, 10);
            scene.add(dirLight);

            animatedGroup = new THREE.Group();
            scene.add(animatedGroup);

            const bgGeo = new THREE.BufferGeometry();
            const bgCount = 400;
            const bgPositions = new Float32Array(bgCount * 3);
            for(let i=0; i<bgCount*3; i++) {
                bgPositions[i] = (Math.random() - 0.5) * 40;
            }
            bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
            const bgMat = new THREE.PointsMaterial({
                color: ${accentColor.replace('#', '0x')},
                size: 0.06,
                transparent: true,
                opacity: 0.35
            });
            bgParticles = new THREE.Points(bgGeo, bgMat);
            scene.add(bgParticles);

            if (currentTopic.includes('双摆') || currentTopic.includes('摆')) {
                const bobMat1 = new THREE.MeshStandardMaterial({ color: 0xff5555, roughness: 0.1 });
                const bobMat2 = new THREE.MeshStandardMaterial({ color: 0x33b8ff, roughness: 0.1 });
                const bobGeo = new THREE.SphereGeometry(0.5, 32, 32);
                
                const bob1 = new THREE.Mesh(bobGeo, bobMat1);
                const bob2 = new THREE.Mesh(bobGeo, bobMat2);
                bob1.name = 'bob1';
                bob2.name = 'bob2';
                
                animatedGroup.add(bob1);
                animatedGroup.add(bob2);
            } else if (currentTopic.includes('DNA') || currentTopic.includes('生物') || currentTopic.includes('双螺旋') || currentTopic.includes('复制')) {
                const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
                for(let i = -10; i <= 10; i += 0.8) {
                    const group = new THREE.Group();
                    group.position.y = i;
                    group.name = 'dna_' + i;

                    const m1 = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
                    const m2 = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0xfb7185 }));
                    m1.position.x = 2;
                    m2.position.x = -2;

                    group.add(m1);
                    group.add(m2);

                    const lineGeo = new THREE.BoxGeometry(4, 0.05, 0.05);
                    const lineMat = new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.4 });
                    const line = new THREE.Mesh(lineGeo, lineMat);
                    group.add(line);

                    animatedGroup.add(group);
                }
            } else if (currentTopic.includes('电磁') || currentTopic.includes('磁')) {
                const magnetGeo = new THREE.BoxGeometry(1.5, 4, 1.5);
                const magnetMat = new THREE.MeshPhysicalMaterial({ color: 0xff3355, roughness: 0.1, metalness: 0.8 });
                const magnet = new THREE.Mesh(magnetGeo, magnetMat);
                magnet.name = 'magnet';
                animatedGroup.add(magnet);

                for(let i = -4; i <= 4; i += 1.5) {
                    const coilGeo = new THREE.TorusGeometry(3, 0.08, 16, 100);
                    const coilMat = new THREE.MeshStandardMaterial({ color: 0xfabf24, metalness: 0.9, roughness: 0.2 });
                    const coil = new THREE.Mesh(coilGeo, coilMat);
                    coil.rotation.x = Math.PI / 2;
                    coil.position.y = i - 0.5;
                    coil.position.z = -1;
                    animatedGroup.add(coil);
                }
            } else if (currentTopic.includes('黑洞') || currentTopic.includes('视界') || currentTopic.includes('吸积')) {
                const bhGeo = new THREE.SphereGeometry(2.2, 32, 32);
                const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const blackHole = new THREE.Mesh(bhGeo, bhMat);
                blackHole.name = 'black_hole';
                animatedGroup.add(blackHole);

                const diskGeo = new THREE.BufferGeometry();
                const diskCount = 800;
                const diskPositions = new Float32Array(diskCount * 3);
                for(let i=0; i<diskCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = 3.5 + Math.random() * 5.0; 
                    diskPositions[i*3] = r * Math.cos(angle);
                    diskPositions[i*3+1] = (Math.random() - 0.5) * 0.3; 
                    diskPositions[i*3+2] = r * Math.sin(angle);
                }
                diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
                const diskMat = new THREE.PointsMaterial({
                    color: 0xff6600, 
                    size: 0.12,
                    transparent: true,
                    opacity: 0.8
                });
                const accretionDisk = new THREE.Points(diskGeo, diskMat);
                accretionDisk.name = 'accretion_disk';
                scene.add(accretionDisk);
            } else if (currentTopic.includes('声波') || currentTopic.includes('共振') || currentTopic.includes('振动') || currentTopic.includes('声')) {
                const waveGeo = new THREE.BufferGeometry();
                const waveCount = 900;
                const wavePositions = new Float32Array(waveCount * 3);
                for(let i=0; i<waveCount; i++) {
                    wavePositions[i*3] = (Math.random() - 0.5) * 20; 
                    wavePositions[i*3+1] = (Math.random() - 0.5) * 6;
                    wavePositions[i*3+2] = (Math.random() - 0.5) * 6;
                }
                waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
                const waveMat = new THREE.PointsMaterial({
                    color: ${accentColor.replace('#', '0x')},
                    size: 0.15,
                    transparent: true,
                    opacity: 0.8
                });
                const waveParticles = new THREE.Points(waveGeo, waveMat);
                waveParticles.name = 'wave_particles';
                animatedGroup.add(waveParticles);
            } else if (currentTopic.includes('热') || currentTopic.includes('分子') || currentTopic.includes('温度') || currentTopic.includes('碰撞') || currentTopic.includes('气体')) {
                const gasGroup = new THREE.Group();
                gasGroup.name = 'gas_group';
                const sphereGeo = new THREE.SphereGeometry(0.2, 8, 8);
                const gasCount = 35;
                const colors = [0xff5555, 0x33ff55, 0x3355ff, 0xffff33, 0xff33ff];
                for(let i=0; i<gasCount; i++) {
                    const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.1 });
                    const ball = new THREE.Mesh(sphereGeo, mat);
                    ball.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
                    ball.userData = {
                        vel: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4)
                    };
                    gasGroup.add(ball);
                }
                animatedGroup.add(gasGroup);
            } else if (currentTopic.includes('斐波那契') || currentTopic.includes('螺旋') || currentTopic.includes('黄金') || currentTopic.includes('对数')) {
                const spiralGeo = new THREE.BufferGeometry();
                const spiralCount = 1200;
                const spiralPositions = new Float32Array(spiralCount * 3);
                const aVal = 0.15;
                const bVal = 0.18;
                for(let i=0; i<spiralCount; i++) {
                    const theta = (i / spiralCount) * Math.PI * 10; 
                    const r = aVal * Math.exp(bVal * theta);
                    spiralPositions[i*3] = r * Math.cos(theta);
                    spiralPositions[i*3+1] = 0;
                    spiralPositions[i*3+2] = r * Math.sin(theta);
                }
                spiralGeo.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
                const spiralMat = new THREE.PointsMaterial({
                    color: ${accentColor.replace('#', '0x')},
                    size: 0.12,
                    transparent: true,
                    opacity: 0.9
                });
                const spiralLine = new THREE.Points(spiralGeo, spiralMat);
                spiralLine.name = 'spiral_line';
                animatedGroup.add(spiralLine);
            } else if (currentTopic.includes('日月食') || currentTopic.includes('引力') || currentTopic.includes('公转') || currentTopic.includes('自转') || currentSubject === '天文') {
                const starGeo = new THREE.SphereGeometry(2, 32, 32);
                const starMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
                const star = new THREE.Mesh(starGeo, starMat);
                animatedGroup.add(star);

                const planetGeo = new THREE.SphereGeometry(0.6, 32, 32);
                const planetMat = new THREE.MeshStandardMaterial({ color: 0x22aaff, roughness: 0.8 });
                const planet = new THREE.Mesh(planetGeo, planetMat);
                planet.position.x = 8;
                planet.name = 'planet';
                animatedGroup.add(planet);

                const ringGeo = new THREE.TorusGeometry(8, 0.02, 8, 100);
                const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
                ring.rotation.x = Math.PI/2;
                scene.add(ring);
            } else {
                let mainGeo;
                if (currentHash % 4 === 0) {
                    mainGeo = new THREE.TorusKnotGeometry(1.6, 0.4, 100, 16); 
                } else if (currentHash % 4 === 1) {
                    mainGeo = new THREE.OctahedronGeometry(2.5, 1); 
                } else if (currentHash % 4 === 2) {
                    mainGeo = new THREE.DodecahedronGeometry(2.5, 0); 
                } else {
                    mainGeo = new THREE.IcosahedronGeometry(2.6, 1); 
                }
                
                const mainMat = new THREE.MeshPhysicalMaterial({
                    color: ${accentColor.replace('#', '0x')},
                    roughness: 0.1,
                    transmission: 0.6,
                    transparent: true,
                    opacity: 0.8
                });
                const mainBody = new THREE.Mesh(mainGeo, mainMat);
                mainBody.name = 'main_poly';
                animatedGroup.add(mainBody);

                let orbGeo;
                if (currentHash % 2 === 0) {
                    orbGeo = new THREE.TorusGeometry(5, 0.04, 16, 100);
                } else {
                    orbGeo = new THREE.TorusGeometry(4.2, 0.08, 8, 4); 
                }
                const orbMat = new THREE.MeshBasicMaterial({ color: ${accentColor.replace('#', '0x')}, transparent: true, opacity: 0.5 });
                const orbit = new THREE.Mesh(orbGeo, orbMat);
                orbit.name = 'orbit';
                animatedGroup.add(orbit);
            }
        }

        function updateSVGChart() {
            const svg = document.getElementById('svg-vt-chart');
            if(!svg) return;
            const w = svg.clientWidth || 300;
            const h = svg.clientHeight || 120;
            const margin = { top: 10, right: 10, bottom: 20, left: 30 };
            
            const chartW = w - margin.left - margin.right;
            const chartH = h - margin.top - margin.bottom;
            const history = State.history;

            let content = '';
            content += '<line x1="' + margin.left + '" y1="' + margin.top + '" x2="' + margin.left + '" y2="' + (h - margin.bottom) + '" stroke="#475569" stroke-width="1" />';
            content += '<line x1="' + margin.left + '" y1="' + (h - margin.bottom) + '" x2="' + (w - margin.right) + '" y2="' + (h - margin.bottom) + '" stroke="#475569" stroke-width="1" />';
            content += '<text x="' + (margin.left - 5) + '" y="' + (margin.top + 8) + '" fill="#64748b" font-size="8" text-anchor="end">动能 (K)</text>';
            content += '<text x="' + (w - margin.right) + '" y="' + (h - margin.bottom + 12) + '" fill="#64748b" font-size="8" text-anchor="end">时间 t</text>';

            if(history.length > 1) {
                const maxT = history[history.length - 1].t;
                const minT = Math.max(0, maxT - 8);
                const maxVal = 25.0;

                const mapX = (t) => margin.left + ((t - minT) / (maxT - minT || 1)) * chartW;
                const mapY = (v) => h - margin.bottom - (Math.min(maxVal, v) / maxVal) * chartH;

                let points = [];
                history.forEach(d => {
                    if (d.t >= minT) {
                        points.push(mapX(d.t).toFixed(1) + ',' + mapY(d.val).toFixed(1));
                    }
                });

                if(points.length > 0) {
                    content += '<path d="M ' + points.join(' L ') + '" fill="none" stroke="${accentColor}" stroke-width="1.8" stroke-linecap="round" />';
                }
            }
            svg.innerHTML = content;
        }

        function animate() {
            requestAnimationFrame(animate);

            if (State.isPlaying) {
                const dt = 0.016 * State.simSpeed;
                State.time += dt;

                if (currentTopic.includes('双摆') || currentTopic.includes('摆')) {
                    const bob1 = animatedGroup.getObjectByName('bob1');
                    const bob2 = animatedGroup.getObjectByName('bob2');
                    if (bob1 && bob2) {
                        const theta1 = 0.8 * Math.sin(State.time * 2.0 * State.val1);
                        const theta2 = 1.2 * Math.cos(State.time * 1.5 + State.val1);
                        const length1 = 4;
                        const length2 = 3;

                        bob1.position.set(length1 * Math.sin(theta1), -length1 * Math.cos(theta1), 0);
                        bob2.position.set(
                            bob1.position.x + length2 * Math.sin(theta2),
                            bob1.position.y - length2 * Math.cos(theta2),
                            0
                        );

                        const v1 = 2.0 * State.val1 * length1 * Math.cos(theta1);
                        const v2 = 1.5 * length2 * Math.sin(theta2);
                        const kineticEnergy = 0.5 * (v1 * v1 + v2 * v2);
                        
                        document.getElementById('hud-var1').textContent = theta1.toFixed(2);
                        document.getElementById('hud-var2').textContent = (v1 + v2).toFixed(2);
                        document.getElementById('hud-energy').textContent = kineticEnergy.toFixed(2) + ' J';

                        State.history.push({ t: State.time, val: kineticEnergy });
                    }
                } else if (currentTopic.includes('DNA') || currentTopic.includes('生物') || currentTopic.includes('双螺旋') || currentTopic.includes('复制')) {
                    animatedGroup.children.forEach(child => {
                        if (child.name.startsWith('dna_')) {
                            const offset = parseFloat(child.name.split('_')[1]);
                            child.rotation.y = State.time * State.val1 + offset * 0.3;
                        }
                    });
                    const kineticEnergy = 12.0 * State.val1 * (1.0 - State.val2);
                    document.getElementById('hud-var1').textContent = State.val1.toFixed(2);
                    document.getElementById('hud-var2').textContent = (Math.sin(State.time) * State.val1).toFixed(2);
                    document.getElementById('hud-energy').textContent = kineticEnergy.toFixed(2) + ' eV';
                    State.history.push({ t: State.time, val: kineticEnergy + 3.0 * Math.sin(State.time * 2.5) });
                } else if (currentTopic.includes('电磁') || currentTopic.includes('磁')) {
                    const magnet = animatedGroup.getObjectByName('magnet');
                    if (magnet) {
                        const yPos = 3.0 * Math.sin(State.time * State.val1);
                        magnet.position.y = yPos;
                        magnet.rotation.y = State.time * 0.5;

                        const EMF = 3.0 * State.val1 * Math.cos(State.time * State.val1) * (1.0 - State.val2);
                        const power = EMF * EMF;
                        
                        document.getElementById('hud-var1').textContent = yPos.toFixed(2) + ' m';
                        document.getElementById('hud-var2').textContent = EMF.toFixed(2) + ' V';
                        document.getElementById('hud-energy').textContent = power.toFixed(2) + ' W';
                        State.history.push({ t: State.time, val: power });
                    }
                } else if (currentTopic.includes('黑洞') || currentTopic.includes('视界') || currentTopic.includes('吸积')) {
                    const disk = scene.getObjectByName('accretion_disk');
                    if (disk) {
                        disk.rotation.y = State.time * 1.5 * State.val1;
                    }
                    const bh = animatedGroup.getObjectByName('black_hole');
                    if (bh) {
                        bh.rotation.y = -State.time * 0.2;
                    }
                    const Rs = 2.0 * State.val1; 
                    document.getElementById('hud-var1').textContent = Rs.toFixed(2) + ' km';
                    document.getElementById('hud-var2').textContent = (State.val1 * 3.0).toFixed(2) + ' c';
                    document.getElementById('hud-energy').textContent = (Rs * 12.5).toFixed(2) + ' erg';
                    State.history.push({ t: State.time, val: Rs * 6.0 * (1.0 + 0.15 * Math.sin(State.time * 5.0)) });
                } else if (currentTopic.includes('声波') || currentTopic.includes('共振') || currentTopic.includes('振动') || currentTopic.includes('声')) {
                    const wave = animatedGroup.getObjectByName('wave_particles');
                    if (wave) {
                        const pos = wave.geometry.attributes.position.array;
                        const len = pos.length / 3;
                        for(let i=0; i<len; i++) {
                            const x0 = pos[i*3];
                            const waveOffset = 0.6 * Math.sin(State.time * 6.0 * State.val1 + x0 * 1.2) * (1.0 - State.val2);
                            pos[i*3] = x0 + waveOffset * 0.05; 
                        }
                        wave.geometry.attributes.position.needsUpdate = true;
                    }
                    const kineticEnergy = 10.0 * State.val1 * (1.0 - State.val2);
                    document.getElementById('hud-var1').textContent = (Math.sin(State.time * 6.0) * State.val1).toFixed(2) + ' m/s';
                    document.getElementById('hud-var2').textContent = (State.val1 * 340).toFixed(0) + ' m/s';
                    document.getElementById('hud-energy').textContent = kineticEnergy.toFixed(2) + ' dB';
                    State.history.push({ t: State.time, val: kineticEnergy * (1.0 + 0.3 * Math.sin(State.time * 8.0)) });
                } else if (currentTopic.includes('热') || currentTopic.includes('分子') || currentTopic.includes('温度') || currentTopic.includes('碰撞') || currentTopic.includes('气体')) {
                    const gasGroup = animatedGroup.getObjectByName('gas_group');
                    if (gasGroup) {
                        const tempFactor = State.val1 * 1.5; 
                        gasGroup.children.forEach(ball => {
                            ball.position.addScaledVector(ball.userData.vel, dt * tempFactor);
                            const bound = 4.0;
                            if (Math.abs(ball.position.x) > bound) { ball.userData.vel.x *= -1; ball.position.x = Math.sign(ball.position.x) * bound; }
                            if (Math.abs(ball.position.y) > bound) { ball.userData.vel.y *= -1; ball.position.y = Math.sign(ball.position.y) * bound; }
                            if (Math.abs(ball.position.z) > bound) { ball.userData.vel.z *= -1; ball.position.z = Math.sign(ball.position.z) * bound; }
                        });
                    }
                    const kineticEnergy = 15.0 * State.val1;
                    document.getElementById('hud-var1').textContent = State.val1.toFixed(2) + ' K';
                    document.getElementById('hud-var2').textContent = (State.val1 * 8.31).toFixed(2) + ' J/mol';
                    document.getElementById('hud-energy').textContent = kineticEnergy.toFixed(2) + ' eV';
                    State.history.push({ t: State.time, val: kineticEnergy + 4.5 * (Math.random() - 0.5) });
                } else if (currentTopic.includes('斐波那契') || currentTopic.includes('螺旋') || currentTopic.includes('黄金') || currentTopic.includes('对数')) {
                    const spiral = animatedGroup.getObjectByName('spiral_line');
                    if (spiral) {
                        spiral.rotation.y = State.time * 0.4 * State.val1;
                        spiral.scale.setScalar(1.0 + 0.1 * Math.sin(State.time * State.val1));
                    }
                    const ratio = 1.61803398 + 0.02 * Math.sin(State.time) * State.val2;
                    document.getElementById('hud-var1').textContent = ratio.toFixed(6);
                    document.getElementById('hud-var2').textContent = State.val1.toFixed(2);
                    document.getElementById('hud-energy').textContent = (ratio * 100).toFixed(2) + ' %';
                    State.history.push({ t: State.time, val: ratio * 10.0 + Math.sin(State.time * 2.0) });
                } else if (currentTopic.includes('日月食') || currentTopic.includes('引力') || currentTopic.includes('公转') || currentTopic.includes('自转') || currentSubject === '天文') {
                    const planet = animatedGroup.getObjectByName('planet');
                    if (planet) {
                        const radius = 8.0;
                        const angle = State.time * State.val1 * 0.5;
                        planet.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));

                        const gravity = (State.val1 * 5.0) / (radius * radius);
                        document.getElementById('hud-var1').textContent = radius.toFixed(2) + ' AU';
                        document.getElementById('hud-var2').textContent = (State.val1 * 0.5).toFixed(2) + ' rad/s';
                        document.getElementById('hud-energy').textContent = gravity.toFixed(3) + ' m/s²';
                        State.history.push({ t: State.time, val: gravity * 8.0 * (1.0 + 0.1 * Math.sin(State.time * 4)) });
                    }
                } else {
                    const poly = animatedGroup.getObjectByName('main_poly');
                    const orbit = animatedGroup.getObjectByName('orbit');
                    
                    const rotDirX = (currentHash % 2 === 0) ? 1 : -1;
                    const rotDirY = ((currentHash >> 2) % 2 === 0) ? 1 : -1;
                    const rotSpeedX = 0.4 * (1.0 + (currentHash % 5) * 0.15) * State.val1;
                    const rotSpeedY = 0.6 * (1.0 + (currentHash % 3) * 0.1) * rotDirY;
                    
                    if (poly) {
                        poly.rotation.x = State.time * rotSpeedX * rotDirX;
                        poly.rotation.y = State.time * rotSpeedY;
                    }
                    if (orbit) {
                        orbit.rotation.z = -State.time * State.val1 * 0.8 * rotDirX;
                    }
                    const kineticEnergy = 8.5 * State.val1 * (1.0 - State.val2);
                    document.getElementById('hud-var1').textContent = State.val1.toFixed(2);
                    document.getElementById('hud-var2').textContent = (Math.sin(State.time) * State.val1).toFixed(2);
                    document.getElementById('hud-energy').textContent = kineticEnergy.toFixed(2) + ' J';
                    State.history.push({ t: State.time, val: kineticEnergy + 2.0 * Math.sin(State.time * 1.5 + (currentHash % 5)) });
                }

                if(State.history.length > 150) State.history.shift();

                bgParticles.rotation.y = State.time * 0.05;
                updateSVGChart();
            }

            controls.update();
            renderer.render(scene, camera);
        }

        const quizData = ${JSON.stringify(quizzes)};
        let currentQuizIndex = 0;

        function loadQuiz(index) {
            if(index >= quizData.length) {
                document.getElementById('quiz-content').innerHTML = '<div class="text-center p-4"><span class="text-3xl">🏆</span><h4 class="font-bold text-slate-100 mt-2 text-sm">恭喜！全部小测验已完成！</h4><p class="text-slate-500 text-[10px] mt-1">您已经深度掌握了该项科学概念的核心内涵。</p><button onclick="currentQuizIndex = 0; loadQuiz(0);" class="mt-3 px-3 py-1 bg-white text-slate-950 rounded font-semibold text-[10px]">重新开始</button></div>';
                return;
            }

            const quiz = quizData[index];
            document.getElementById('quiz-question-num').textContent = '问题 ' + (index + 1) + ' of ' + quizData.length;
            document.getElementById('quiz-question').textContent = quiz.question;

            const optsDiv = document.getElementById('quiz-options');
            optsDiv.innerHTML = '';
            
            quiz.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = "w-full p-2.5 rounded-lg border border-white/5 bg-slate-900/60 hover:bg-white/5 text-left text-[11px] text-slate-300 hover:text-slate-100 active:scale-98 transition-all";
                btn.textContent = opt;
                btn.onclick = () => selectOption(idx);
                optsDiv.appendChild(btn);
            });

            document.getElementById('quiz-feedback').classList.add('hidden');
        }

        function selectOption(optIndex) {
            const quiz = quizData[currentQuizIndex];
            const feedback = document.getElementById('quiz-feedback');
            feedback.classList.remove('hidden');

            if(optIndex === quiz.correct) {
                feedback.className = "p-2.5 rounded-lg border text-[11px] leading-relaxed bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                feedback.innerHTML = '<b>🎉 回答正确！</b><br>' + quiz.explanation + '<br><button onclick="currentQuizIndex++; loadQuiz(currentQuizIndex);" class="mt-2 text-[10px] font-bold underline">进入下一题 ➔</button>';
            } else {
                feedback.className = "p-2.5 rounded-lg border text-[11px] leading-relaxed bg-rose-500/10 border-rose-500/30 text-rose-400";
                feedback.innerHTML = '<b>❌ 回答错误。</b><br>请再次阅读讲解并思考！';
            }
        }

        document.getElementById('slider-1').addEventListener('input', (e) => {
            State.val1 = parseFloat(e.target.value);
            document.getElementById('val-slider1').textContent = State.val1.toFixed(2);
        });
        document.getElementById('slider-2').addEventListener('input', (e) => {
            State.val2 = parseFloat(e.target.value);
            document.getElementById('val-slider2').textContent = State.val2.toFixed(2);
        });
        document.getElementById('btn-play-pause').addEventListener('click', () => {
            State.isPlaying = !State.isPlaying;
        });
        document.getElementById('btn-reset').addEventListener('click', () => {
            State.time = 0;
            State.history = [];
            State.isPlaying = true;
        });
        document.getElementById('select-speed').addEventListener('change', (e) => {
            State.simSpeed = parseFloat(e.target.value);
        });
        document.getElementById('btn-quiz-close').addEventListener('click', () => {
            document.getElementById('quiz-panel').style.display = 'none';
        });

        function startSimulationSafe() {
            if (typeof THREE === 'undefined' || typeof renderMathInElement === 'undefined') {
                setTimeout(startSimulationSafe, 100);
                return;
            }
            try {
                init3D();
                loadQuiz(0);
                animate();
                
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ]
                });
                document.getElementById('latex-formula').innerHTML = '$$ ' + ${JSON.stringify(formula)} + ' $$';
                renderMathInElement(document.getElementById('latex-formula'));
            } catch (err) {
                showVisualError('动力学引擎初设故障：' + err.message, err.stack);
            }
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            startSimulationSafe();
        } else {
            window.addEventListener('DOMContentLoaded', startSimulationSafe);
        }
            `;
        }\n\n        // ==========================================
        // 6. 个人历史列表状态管理 (localStorage)
        // ==========================================

        function loadHistoryFromStorage() {
            const raw = localStorage.getItem('aetherviz_history');
            if (raw) {
                try {
                    AppState.history = JSON.parse(raw);
                } catch(e) {
                    AppState.history = [];
                }
            }
            renderHistoryList();
        }

        function renderHistoryList() {
            const container = document.getElementById('history-container');
            const countBadge = document.getElementById('history-count');
            
            countBadge.textContent = AppState.history.length;
            
            if (AppState.history.length === 0) {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-center text-slate-600 p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                        <span class="text-2xl mb-2">⚡</span>
                        <p class="text-[11px] leading-relaxed">暂无本地生成记录，输入提示词开启全新教学可视化！</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            
            const sorted = [...AppState.history].reverse();
            
            sorted.forEach(item => {
                const div = document.createElement('div');
                div.className = "flex items-center justify-between p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/20 transition-all text-xs group relative";
                
                let tagColor = 'bg-cyan-500/20 text-cyan-400';
                if (item.subject === '化学') tagColor = 'bg-emerald-500/20 text-emerald-400';
                else if (item.subject === '生物') tagColor = 'bg-orange-500/20 text-orange-400';
                else if (item.subject === '数学') tagColor = 'bg-amber-500/20 text-amber-400';
                else if (item.subject === '天文') tagColor = 'bg-indigo-500/20 text-indigo-400';
                else if (item.subject === '综合') tagColor = 'bg-purple-500/20 text-purple-400';

                div.innerHTML = `
                    <button onclick="loadSavedHistoryItem('${item.id}')" class="flex-1 text-left flex flex-col gap-1 overflow-hidden pr-2">
                        <span class="text-slate-200 font-medium truncate text-left">${item.title}</span>
                        <div class="flex items-center gap-2 text-[9px] text-slate-500">
                            <span class="px-1.5 py-0.5 rounded ${tagColor}">${item.subject}</span>
                            <span>${item.time}</span>
                        </div>
                    </button>
                    <!-- 快捷操作按钮 -->
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-slate-950/90 py-1 pl-2 rounded-l-lg border-l border-cyan-500/20">
                        <button onclick="exportSavedHTML('${item.id}', event)" class="w-6 h-6 rounded bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/40 flex items-center justify-center text-[10px]" title="单独导出为 HTML 文件">
                            📥
                        </button>
                        <button onclick="deleteHistoryItem('${item.id}', event)" class="w-6 h-6 rounded bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800/40 flex items-center justify-center text-[10px]" title="删除本条历史">
                            🗑️
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        // ==========================================
        // 6. 顶栏 HUD 操作事件绑定
        // ==========================================

        function saveCurrentToHistory() {
            if (AppState.isCurrentSaved) return;

            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit' });
            
            const newItem = {
                id: 'id_' + Date.now(),
                title: AppState.generatedTitle,
                subject: AppState.generatedSubject,
                time: `${dateStr} ${timeStr}`,
                html: AppState.generatedCode
            };

            AppState.history.push(newItem);
            localStorage.setItem('aetherviz_history', JSON.stringify(AppState.history));
            AppState.isCurrentSaved = true;

            renderHistoryList();

            const saveBtn = document.getElementById('btn-save-history');
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span>✅ 课程已妥善保存</span>`;
            saveBtn.className = saveBtn.className.replace(/from-emerald-500 to-teal-500/g, 'from-slate-700 to-slate-800');
            saveBtn.className = saveBtn.className.replace(/text-slate-950/g, 'text-slate-400');
        }

        function deleteHistoryItem(id, event) {
            event.stopPropagation();
            if (!confirm('确定要删除这条生成历史吗？')) return;

            AppState.history = AppState.history.filter(item => item.id !== id);
            localStorage.setItem('aetherviz_history', JSON.stringify(AppState.history));
            
            renderHistoryList();
        }

        function exportCurrentHTML() {
            if (!AppState.generatedCode) return;
            downloadHTMLFile(AppState.generatedTitle, AppState.generatedCode);
        }

        function exportSavedHTML(id, event) {
            event.stopPropagation();
            const item = AppState.history.find(h => h.id === id);
            if (item) {
                downloadHTMLFile(item.title, item.html);
            }
        }

        function downloadHTMLFile(filename, content) {
            const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `AetherViz_${filename.replace(/\s+/g, '_')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // ==========================================
        // 7. iframe 与外壳交互跳转控制
        // ==========================================

        function loadOfficialPage(fileName) {
            AppState.generatedCode = '';
            AppState.isCurrentSaved = true;

            document.getElementById('panel-generator').classList.add('hidden');
            document.getElementById('panel-generating').classList.add('hidden');
            document.getElementById('panel-preview').classList.remove('hidden');
            document.getElementById('bg-decoration').classList.add('opacity-10');

            let officialTitle = '官方案例课程';
            let officialSubtitle = 'AetherViz 官方物理实验室';
            if (fileName === 'newton.html') {
                officialTitle = '🍎 牛顿第二定律 3D 可视化';
                officialSubtitle = '学科方向：物理学动力学演示';
            } else if (fileName === 'photosynthesis.html') {
                officialTitle = '🌿 光合作用 3D 沉浸式实验';
                officialSubtitle = '学科方向：生命科学叶绿体模拟';
            } else if (fileName === 'pythagoras.html') {
                officialTitle = '📐 勾股定理几何证明';
                officialSubtitle = '学科方向：数学多维代数图形演示';
            } else if (fileName === 'quantum_mechanics.html') {
                officialTitle = '⚛️ 量子力学隧穿效应';
                officialSubtitle = '学科方向：高能物理粒子轨道模拟';
            } else if (fileName === 'ai_workflow.html') {
                officialTitle = '🧠 AI 工作流 3D 可视化';
                officialSubtitle = '学科方向：信息科学计算网络模型';
            }

            document.getElementById('preview-title').textContent = officialTitle;
            document.getElementById('preview-subtitle').textContent = officialSubtitle;

            const saveBtn = document.getElementById('btn-save-history');
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span>内置官方案例</span>`;
            saveBtn.className = saveBtn.className.replace(/from-emerald-500 to-teal-500/g, 'from-slate-700 to-slate-800');
            saveBtn.className = saveBtn.className.replace(/text-slate-950/g, 'text-slate-400');

            document.getElementById('preview-iframe').src = fileName;
        }

        function loadSavedHistoryItem(id) {
            const item = AppState.history.find(h => h.id === id);
            if (!item) return;

            AppState.generatedCode = item.html;
            AppState.generatedTitle = item.title;
            AppState.generatedSubject = item.subject;
            AppState.isCurrentSaved = true;

            document.getElementById('panel-generator').classList.add('hidden');
            document.getElementById('panel-generating').classList.add('hidden');
            document.getElementById('panel-preview').classList.remove('hidden');
            document.getElementById('bg-decoration').classList.add('opacity-10');

            document.getElementById('preview-title').textContent = item.title;
            document.getElementById('preview-subtitle').textContent = `学科方向：${item.subject} 级可视化探索`;

            const saveBtn = document.getElementById('btn-save-history');
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span>✅ 课程已妥善保存</span>`;
            saveBtn.className = saveBtn.className.replace(/from-emerald-500 to-teal-500/g, 'from-slate-700 to-slate-800');
            saveBtn.className = saveBtn.className.replace(/text-slate-950/g, 'text-slate-400');

            const iframe = document.getElementById('preview-iframe');
            const blob = new Blob([item.html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            iframe.src = url;
        }

        function showGeneratorPanel() {
            document.getElementById('panel-preview').classList.add('hidden');
            document.getElementById('panel-generating').classList.add('hidden');
            document.getElementById('panel-generator').classList.remove('hidden');
            document.getElementById('bg-decoration').classList.remove('opacity-10');
            
            document.getElementById('preview-iframe').src = 'about:blank';
        }

        function closePreview() {
            if (!AppState.isCurrentSaved) {
                if (!confirm('当前课程未保存到左侧历史列表，关闭将丢失本次生成，确定要关闭吗？')) {
                    return;
                }
            }
            showGeneratorPanel();
        }
    

// 测试 1：黑洞吸积
const r1 = assembleHTMLPage('黑洞事件视界吸积盘', '天文');
fs.writeFileSync('temp_blackhole.html', r1.html);
console.log('Test 1: black hole HTML generated.');

// 测试 2：气体分子碰撞
const r2 = assembleHTMLPage('理想气体分子热运动碰撞', '物理');
fs.writeFileSync('temp_gas.html', r2.html);
console.log('Test 2: gas thermal HTML generated.');

// 测试 3：兜底泛化 - 火山喷发
const r3 = assembleHTMLPage('火山喷发能量地壳活动', '物理');
fs.writeFileSync('temp_volcano.html', r3.html);
console.log('Test 3: volcano default HTML generated.');
