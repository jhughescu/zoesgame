import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('cookie');
  const [teamName, setTeamName] = useState('');
  const [round, setRound] = useState(0);
  const [carryOverResources, setCarryOverResources] = useState(0);
  const [gameState, setGameState] = useState({
    innovation: 100,
    financial: 100,
    reputation: 100,
    strategic: 100
  });
  const [viewedMarket, setViewedMarket] = useState(false);
  const [viewedPlayers, setViewedPlayers] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [lastRoundFeedback, setLastRoundFeedback] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [writingResponse, setWritingResponse] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120);

  useEffect(() => {
    if (screen === 'feedback' && round > 0) {
      setCanContinue(false);
      const timer = setTimeout(() => setCanContinue(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [screen, round]);

  useEffect(() => {
    if (screen === 'writing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeRemaining]);

  const players = {
    citadel: { name: 'Citadel', subtitle: 'The Incumbent Power', values: 'Credibility, legacy, evidence-based medicine', drives: 'Long-term market leadership, system stability' },
    aegis: { name: 'Aegis', subtitle: 'The Regulator', values: 'Rigorous standards, documentation, transparency', drives: 'Public accountability, safety, jurisdictional control' },
    pinnacle: { name: 'Pinnacle Equity', subtitle: 'The Shareholder Syndicate', values: 'Performance, cost-efficiency, deal-making', drives: 'Shareholder value, capital velocity' },
    peoplefirst: { name: 'PeopleFirst', subtitle: 'Civil Watchdog', values: 'Transparency, patient voice, decentralization', drives: 'Access, affordability, social justice' },
    plusplayr: { name: 'PlusPlayr', subtitle: 'The Failed Disruptor', values: 'Openness, decentralization, anti-institutionalism', drives: 'Speed, disruption, data democratization' },
    neuraledge: { name: 'Neuraledge', subtitle: 'The Successful Disruptor', values: 'Systems design, scalability, interoperability', drives: 'System-wide disruption, patient autonomy' }
  };

  const allStrategies = {
    0: [
      { id: 'c1', title: 'Circle the Wagons', type: 'Block', desc: 'Build a cross-functional task force focused on lobbying, legal protections, and defensive patenting. Challenge entrants before they can scale.', scores: { i: -2, f: 1, r: -1, s: -1 } },
      { id: 'c2', title: 'Start a Fire', type: 'Innovate', desc: 'Launch open-source pilots and invite external developers and community clinics to co-create solutions. Engage your own staff in live ideation rounds.', scores: { i: 3, f: -2, r: 2, s: 1 } },
      { id: 'c3', title: 'Leverage the Legacy', type: 'Exploit', desc: 'Focus on optimising and extending your current cash cows. Strengthen existing product lines and create loyalty programmes.', scores: { i: -1, f: 3, r: -1, s: -1 } },
      { id: 'c4', title: 'Snatch the Disruptors', type: 'Buy', desc: 'Quietly acquire small startups with interesting or innovative IP and talent. Position Citadel to move fast later.', scores: { i: 1, f: -2, r: 0, s: 2 } },
      { id: 'c5', title: 'Add to the War Chest', type: 'Do Nothing', desc: 'Strategically allocate resources to capital, talent, and attention. Monitor activity and be poised to strike when others overextend.', scores: { i: 0, f: 2, r: 1, s: 3 } }
    ],
    1: [
      { id: 'e1', title: 'Seize the Narrative', type: 'Block', desc: 'Launch a PR campaign to reassure investors. Emphasise Citadel\'s long-standing partnerships and compliance record. Reinforce your moat through licensing and litigation.', scores: { i: -2, f: 2, r: 0, s: -1 } },
      { id: 'e2', title: 'Sound the Alarm', type: 'Innovate', desc: 'Unveil an AI innovation lab and invite partners to co-design experimental services for the underserved. Live-stream the launch with med-tech influencers.', scores: { i: 3, f: -2, r: 2, s: 1 } },
      { id: 'e3', title: 'Play to Your Strengths', type: 'Exploit', desc: 'Freeze R&D spend. Funnel all capital into expanding your existing services. Maximise short-term margins to reassure investors with quarterly strength.', scores: { i: -1, f: 3, r: -1, s: -2 } },
      { id: 'e4', title: 'Swallow the Sparks', type: 'Buy', desc: 'Authorise more ambitious acquisitions. Target small startups drawing attention in key verticals and rebrand their offerings as your own.', scores: { i: 2, f: -3, r: 0, s: 2 } },
      { id: 'e5', title: 'Build the Arsenal', type: 'Do Nothing', desc: 'Hold your ground. Reinvest profits into liquid reserves and strategic slack. Monitor both the disruptors and investor mood.', scores: { i: 0, f: 2, r: -1, s: 3 } }
    ],
    2: [
      { id: 'p1', title: 'Steady the Ship', type: 'Block', desc: 'File early data provenance objections. Publicly question their records. Push for inquiries into their tech and highlight your existing compliance record. Slow their ascent with bureaucracy and concern while you regroup behind the scenes.', scores: { i: -2, f: 1, r: -1, s: -1 } },
      { id: 'p2', title: 'Outpace the Upstart', type: 'Innovate', desc: 'Announce your own initiative — a user-first, open-access trial space for emerging tech. Co-develop with clinicians, patients, the NHS, NGOs and ethical AI researchers. Match the excitement Plusplayr has generated but root yours in credibility.', scores: { i: 4, f: -3, r: 2, s: 2 } },
      { id: 'p3', title: 'Max the Margins', type: 'Exploit', desc: 'Offer premium upgrades to your most profitable segments. Bundle diagnostics, insurance, and care into unbeatable long-term packages. Increase switching costs to deter high-value customers from defecting.', scores: { i: -1, f: 4, r: -2, s: -2 } },
      { id: 'p4', title: 'Swallow the Spark', type: 'Buy', desc: 'Offer exclusive partnership deals and prepare for a pre-emptive acquisition. Rebrand their services as your own and start integrating their tech.', scores: { i: 2, f: -3, r: 0, s: 3 } },
      { id: 'p5', title: 'Read the Room', type: 'Do Nothing', desc: 'There\'s too much market chatter and noise, hold position. Set up a shadow project team to quietly assess Plusplayr\'s offering in depth — its tech stack, customer base, regulatory exposure, and burn rate.', scores: { i: 0, f: 2, r: -2, s: 3 } }
    ],
    3: [
      { id: 'r1', title: 'Set the Standard', type: 'Block', desc: 'Position yourself as the gold standard in ethical health data. Push for your own protocols to be the industry norms. Advocate for the Act to go even further — in ways that tighten the noose on less-prepared rivals.', scores: { i: -1, f: 2, r: 3, s: -1 } },
      { id: 'r2', title: 'Code for the Commons', type: 'Innovate', desc: 'Announce a Health Data Ethics fellowship at a leading University, a public AI transparency dashboard, and a challenge fund for community innovation.', scores: { i: 5, f: -3, r: 3, s: 2 } },
      { id: 'r3', title: 'Leverage Core Assets', type: 'Exploit', desc: 'Highlight compliance of existing offers in a special investor report. Rebrand your proprietary tools with the "HealthSafe" trustmark and raise prices modestly on premium packages. Shift marketing to focus on stability and regulatory readiness.', scores: { i: -1, f: 4, r: 1, s: -1 } },
      { id: 'r4', title: 'Eat What You Kill', type: 'Buy', desc: 'Consolidate your dominance while projecting benevolence and acquire new firms that may be temporarily undervalued. Offer lifeboat valuations in exchange for IP and talent. Repackage the acquisitions as a "Rescue & Redeploy" strategy.', scores: { i: 3, f: -4, r: 0, s: 3 } },
      { id: 'r5', title: 'Hold the High Ground', type: 'Do Nothing', desc: 'Avoid overreacting in a panicked market. Assign a high-level taskforce to assess your full exposure under the Act. Launch confidential compliance drills and embed observers inside the new regulatory agency and key trade bodies.', scores: { i: 0, f: 2, r: 0, s: 3 } }
    ],
    4: [
      { id: 'f1', title: 'Control the Fallout', type: 'Block', desc: 'Distance yourself from PlusPlayr\'s tainted metrics. Launch a cross-platform media campaign to highlight your internal due diligence. Call for regulatory tightening to prevent future hype-driven disruption.', scores: { i: -1, f: 1, r: 2, s: -1 } },
      { id: 'f2', title: 'Pivot and Prove', type: 'Innovate', desc: 'Publicly reframe the scandal as a wake-up call. Reiterate your "HealthSafe" trustmark — an industry-first certification scheme for data transparency and patient safety. Any acquired tech undergoes intensive scrutiny to earn this trustmark.', scores: { i: 5, f: -3, r: 3, s: 2 } },
      { id: 'f3', title: 'Lock In the Base', type: 'Exploit', desc: 'Reinforce your status as the dependable giant amid chaos. Quietly cut ties with fringe pilots and redirect resources to proven verticals.', scores: { i: -1, f: 4, r: 1, s: -2 } },
      { id: 'f4', title: 'Eat the Leftovers', type: 'Buy', desc: 'Opportunistically salvage this wreckage. Acquire any peripheral IP, infrastructure, or niche datasets that weren\'t tainted. Wrap it into your system and rename it all before the dust settles.', scores: { i: 2, f: -2, r: 0, s: 2 } },
      { id: 'f5', title: 'Watch the Ashes', type: 'Do Nothing', desc: 'Assign a specialist team to run forensic post-mortems on what PlusPlayr got right before they flew too close to the sun. Commission internal simulations on how at-risk Citadel is from a similar failure.', scores: { i: 0, f: 1, r: -1, s: 3 } }
    ],
    5: [
      { id: 'cso1', title: 'Hold the Line', type: 'Block', desc: 'Push back — hard. Reaffirm Citadel\'s conservative strategy. Commission a counter-report challenging Qureshi\'s audit. Highlight recent wins and project confidence in current positioning.', scores: { i: -2, f: 2, r: 0, s: -2 } },
      { id: 'cso2', title: 'Back the Blueprint', type: 'Innovate', desc: 'Redefine Citadel as the ecosystem orchestrator for future healthcare. Create a venture arm to incubate new models. Carve out internal units with startup-style autonomy. Rewire KPIs around agility, experimentation, and patient-centric metrics.', scores: { i: 6, f: -4, r: 3, s: 3 } },
      { id: 'cso3', title: 'Steer the Centre', type: 'Exploit', desc: 'Temper the CSO with a moderated path. Preserve Citadel\'s core strengths — but set up an office to explore new markets cautiously. Create a new premium service that leverages existing capabilities. You will evolve — but on your terms, not hers.', scores: { i: -1, f: 5, r: 1, s: -1 } },
      { id: 'cso4', title: 'Cut a Deal', type: 'Buy', desc: 'Channel the CSO\'s energy into external growth. Offer her a new mandate: lead an accelerated acquisitions strategy. Provide her with a war chest to scout for high-potential startups — especially those in predictive diagnostics, wearable tech, or virtual care.', scores: { i: 3, f: -3, r: 0, s: 3 } },
      { id: 'cso5', title: 'Play for Time', type: 'Do Nothing', desc: 'Thank Qureshi for her candour and assign a blue-ribbon panel to evaluate her recommendations over the next quarter. Freeze any major expenditure. Quietly monitor investor sentiment and stakeholder responses.', scores: { i: 0, f: 2, r: -1, s: 4 } }
    ],
    6: [
      { id: 'n1', title: 'Raise the Drawbridge', type: 'Block', desc: 'Unleash the full arsenal of your policy, legal, and risk teams. Warn that Neuraledge\'s tech moves faster than public safety can follow eg. enabling AI sycophancy. Flood the landscape with white noise while you fortify Citadel\'s moat.', scores: { i: -3, f: 2, r: -2, s: -2 } },
      { id: 'n2', title: 'Build the Beacon', type: 'Innovate', desc: 'Launch a high-visibility public initiative showing how innovation happens, not just what it delivers. Partner with NHS trusts and disability advocates. Broadcast the ethics. Invite criticism. Make Neuraledge look like a closed room in comparison.', scores: { i: 7, f: -4, r: 4, s: 3 } },
      { id: 'n3', title: 'Sweat the Assets', type: 'Exploit', desc: 'Funnel everything into your strongest revenue lines. Roll out an enhanced, compliance-wrapped diagnostic and care package. Activate retention triggers in every segment. Make switching more costly, clunky, and unattractive.', scores: { i: -2, f: 6, r: -2, s: -2 } },
      { id: 'n4', title: 'Bite the Flame', type: 'Buy', desc: 'Send your acquisition team in with instructions to spend big. If Neuraledge won\'t budge, shop around its edges — tech incubators, affiliated spinouts, or ex-staff with inside knowledge. Meanwhile, start work on a clone of Neuraledge\'s core system.', scores: { i: 4, f: -5, r: 0, s: 4 } },
      { id: 'n5', title: 'Sharpen the Saw', type: 'Do Nothing', desc: 'Set up a covert strike team inside Citadel — part war room, part observatory. Map Neuraledge\'s tech, culture, leadership, and backers. Follow their regulatory breadcrumbs and track sentiment like a weathervane. Delay direct engagement.', scores: { i: 0, f: 3, r: -2, s: 5 } }
    ]
  };

  const instructions = {
    0: 'Invest in a maximum of 2 strategies. You have 10 resources and you must invest them all. Adding to the War Chest carries those resources into the next round which can be helpful - or it can be seen as indecisive. You have 2 minutes.',
    1: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can continue. Remember, the same strategy won\'t always work in every situation. You have 2 minutes.',
    2: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can continue. After investing in this round, your updated share price will be revealed. You have 2 minutes.',
    3: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can continue. After investing in this round, your updated share price will be revealed. You have 2 minutes.',
    4: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can continue. After investing in this round, you will be asked to write a short shareholder briefing in response to PlusPlayr\'s fall from grace. You have 2 minutes.',
    5: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can continue. After investing in this round, you will be asked to write a short press release in rebuttal to your audit. You have 2 minutes.',
    6: 'Invest in a maximum of 2 strategies. You must invest all of your resources before you can submit. After investing in this round, you will be asked to write a short employee briefing reiterating your future intentions for Citadel. You have 2 minutes.'
  };

  const writingPrompts = {
    4: { title: 'Shareholder Briefing', to: 'Pinnacle Equity', re: 'PlusPlayr\'s fall from grace' },
    5: { title: 'Press Release', to: 'Various Media Outlets', re: 'Audit rebuttal' },
    6: { title: 'Employee Briefing', to: 'All Citadel employees', re: 'Reiterating future intentions' }
  };

  const getTieredFeedback = (strategyId, amount) => {
    const feedbackMap = {
      c1: { low: 'A few legal drafts are circulated and quiet calls placed to regulators — more gesture than strategy. Internally, it\'s a mild signal: unsettling to some, yet reassuring that safeguards still exist.', med: 'A cross-functional unit forms as legal threats and patent filings surge, drawing fire from media and rivals alike. While morale wavers, shareholders see a moat being firmly defended.', high: 'Cease-and-desists, patent offensives, and regulatory filings pour out in a coordinated siege. Citadel appears impenetrable to outsiders, but inside, the intensity takes its toll.' },
      c2: { low: 'A small ideation session sparks interest internally, though little reaches the outside world. It\'s a tentative move — promising, but early.', med: 'Hackathons and open pitches generate buzz, with one AI tool gaining traction in dev circles. Excitement grows, and momentum hints at a cultural shift in motion.', high: 'Global events and viral prototypes cast Citadel in a new light — dynamic, open, and bold. What began as innovation now feels like reinvention.' },
      c3: { low: 'Minor updates — a new logo, improved perks — refresh the brand without shaking the core. Customers notice, but competitors don\'t.', med: 'Product bundles and loyalty boosts improve short-term metrics, though whispers of complacency circulate. The strategy reassures some, but others see signs of overreliance.', high: 'Legacy assets are pushed hard through aggressive rebranding and contracts that lock in key clients. Revenues spike, but critics warn of diminishing returns.' },
      c4: { low: 'Citadel takes meetings but signs no deals, keeping interest under the radar. It\'s more curiosity than commitment — for now.', med: 'Two startups vanish quietly, later traced back to Citadel\'s stealth acquisitions. Their IP is folded in, sparking quiet confidence within.', high: 'Startups disappear as Citadel rapidly acquires talent, patents, and products. The market senses a silent but deliberate land grab.' },
      c5: { low: 'Spending tightens slightly, hiring slows, and strategy reviews begin behind the scenes. It\'s a cautious, quiet shift.', med: 'Resources are stockpiled and planning intensifies, even as the surface remains calm. Insiders sense latent energy as Citadel prepares for multiple futures.', high: 'A disciplined freeze builds deep reserves and sharpens internal capabilities. While competitors expand, Citadel waits — patient, quiet, and ready.' },
      e1: { low: 'A few cautious statements and a short regulatory note are shared, quietly passed to select analysts. The effort feels defensive, leaving investors to see it more as surface reassurance than real control of the story.', med: 'Messaging floods the wires—white papers, curated briefings, and a reassuring op-ed—while public affairs teams quietly lobby regulators. The market sees the fear dial down, but the mood is more defensive positioning than true momentum.', high: 'A sweeping campaign dominates op-eds, analyst briefings, and policy circles, presenting the firm as a model of "responsible innovation." The push steadies nerves, though the intensity raises doubts about whether this is control or overcompensation.' },
      e2: { low: 'A pilot AI lab is unveiled, shown to a few partners and niche outlets. It lifts staff morale, but externally it lands as symbolic rather than substantial.', med: 'A flashy AI Lab opens with cameras rolling and a limited-access sandbox that draws strong online buzz. Investors take notice, though some suspect spectacle over substance, leaving expectations sharply raised.', high: 'A global livestream showcases a lavish AI Lab launch, complete with influencers, prototypes, and live demos. Excitement surges, but the bold bet also piles pressure onto future delivery.' },
      e3: { low: 'Experimental projects are trimmed back, with savings funneled into refreshing existing services. The modest tweaks reassure some stakeholders but feel more like housecleaning than strategy.', med: 'Moonshots are cut, and core services receive loyalty perks, bundling, and lock-in mechanics. Markets reward the focus with stronger numbers, even as staff grumble about a narrowing vision.', high: 'Speculative divisions are wound down, freeing resources to aggressively expand proven revenue streams. The market reads it as disciplined, though internally creativity feels stifled and long-term horizons shrink.' },
      e4: { low: 'Exploratory talks with small startups generate rumours but no visible outcomes. To outsiders, the company seems curious but cautious.', med: 'Quiet acquisitions of a couple of AI startups slip under the radar, sparking speculation about hidden plans. Integration is bumpy but promising, planting seeds of long-term potential.', high: 'Multiple startups are snapped up, their teams and patents absorbed before rivals can react. The bold spree suggests future capability but raises doubts about the firm\'s ability to digest its haul.' },
      e5: { low: 'Resources are quietly diverted into reserves, while leaders sketch scenarios behind closed doors. Externally, calm borders on passivity.', med: 'Earnings calls emphasize cost discipline and record reserves, with quiet focus on future acquisitions and war-gaming. The market isn\'t thrilled, but it notes the steadiness while others flinch.', high: 'Major capex is frozen, reserves swell, and rehearsed scenarios run across executive teams. Competitors sprint loudly while this restraint signals either masterful patience or looming fragility.' }
    };

    const fb = feedbackMap[strategyId];
    if (!fb) return '';
    if (amount <= 3) return fb.low;
    if (amount <= 6) return fb.med;
    return fb.high;
  };

  const getSharePriceStatus = (price) => {
    if (price > 700) return { title: 'Investor Darling', desc: 'You\'re the market\'s favourite. Efficient, high-performing, dominant. Expect aggressive growth or IPO-scale decisions.' };
    if (price > 600) return { title: 'Profitable Titan', desc: 'You balanced moves well. Shareholders are loyal; you\'re respected but still have internal security.' };
    if (price >= 400) return { title: 'Cautiously Holding On', desc: 'Investors are uncertain. Profits are low, pressure to cut costs or consider divestiture.' };
    if (price >= 200) return { title: 'At-Risk Legacy', desc: 'You\'re bleeding capital. Activist investors, hostile bidders, or regulators are circling.' };
    return { title: 'Dismantled Giant', desc: 'The company will be broken up, acquired, or collapse under debt and irrelevance.' };
  };

  const calculateSharePrice = () => {
    const avg = (gameState.innovation + gameState.financial + gameState.reputation + gameState.strategic) / 4;
    return Math.round(400 + (avg - 100) * 8);
  };

  const handleTeamNameSubmit = () => {
    if (teamName.trim()) {
      setScreen('welcome');
    }
  };

  const totalAvailableResources = 10 + carryOverResources;
  const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);
  const canSubmit = selectedStrategies.length > 0 && selectedStrategies.length <= 2 && totalAllocated === totalAvailableResources;

  const handleStrategyAllocationChange = (strategyId, amount) => {
    const newAmount = Math.max(0, amount);
    if (newAmount === 0) {
      const newAlloc = { ...allocations };
      delete newAlloc[strategyId];
      setAllocations(newAlloc);
      setSelectedStrategies(selectedStrategies.filter(s => s !== strategyId));
    } else {
      if (!selectedStrategies.includes(strategyId) && selectedStrategies.length < 2) {
        setSelectedStrategies([...selectedStrategies, strategyId]);
      }
      setAllocations({ ...allocations, [strategyId]: newAmount });
    }
  };

  const handleSubmitStrategy = () => {
    if (!canSubmit) return;

    let updates = { innovation: 0, financial: 0, reputation: 0, strategic: 0 };
    let carryOver = 0;
    let feedbackTexts = [];

    selectedStrategies.forEach(id => {
      const strat = allStrategies[round].find(s => s.id === id);
      const amount = allocations[id];
      if (strat) {
        updates.innovation += strat.scores.i;
        updates.financial += strat.scores.f;
        updates.reputation += strat.scores.r;
        updates.strategic += strat.scores.s;
        if (strat.type === 'Do Nothing') {
          carryOver += amount;
        }
        const feedback = getTieredFeedback(id, amount);
        if (feedback) feedbackTexts.push(feedback);
      }
    });

    setLastRoundFeedback(feedbackTexts.join('\n\n'));
    setGameState(prev => ({
      innovation: Math.max(0, prev.innovation + updates.innovation),
      financial: Math.max(0, prev.financial + updates.financial),
      reputation: Math.max(0, prev.reputation + updates.reputation),
      strategic: Math.max(0, prev.strategic + updates.strategic)
    }));

    if (round === 4 || round === 5 || round === 6) {
      setTimeRemaining(120);
      setWritingResponse('');
      setScreen('writing');
    } else {
      if (round === 6) {
        setScreen('gameover');
      } else {
        setRound(round + 1);
        setCarryOverResources(carryOver);
        setScreen('feedback');
        setSelectedStrategies([]);
        setAllocations({});
        setViewedMarket(false);
        setViewedPlayers(false);
      }
    }
  };

  const handleWritingSubmit = () => {
    if (round === 6) {
      setScreen('gameover');
    } else {
      setRound(round + 1);
      setCarryOverResources(0);
      setScreen('feedback');
      setSelectedStrategies([]);
      setAllocations({});
      setViewedMarket(false);
      setViewedPlayers(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cookie Screen
  if (screen === 'cookie') {
    return (
      <div className="screen cookie-screen">
        <div className="card">
          <h1>Cookie Statement</h1>
          <p>We use cookies to manage your game session. These do not include sensitive information and are only used during your web session.</p>
          <p>Questions about personal data? Email <a href="mailto:gdpr@cranfield.ac.uk">gdpr@cranfield.ac.uk</a></p>
          <button onClick={() => setScreen('teamname')} className="btn-primary">AGREE</button>
        </div>
      </div>
    );
  }

  // Team Name Screen
  if (screen === 'teamname') {
    return (
      <div className="screen cookie-screen">
        <div className="card">
          <h1>Welcome to Citadel</h1>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTeamNameSubmit()}
            placeholder="Enter your team name"
            className="text-input"
          />
          <button onClick={handleTeamNameSubmit} disabled={!teamName.trim()} className="btn-primary">START</button>
        </div>
      </div>
    );
  }

  // Writing Screen
  if (screen === 'writing') {
    const prompt = writingPrompts[round];
    return (
      <div className="writing-screen">
        <div className="writing-container">
          <div className="writing-header">
            <h1 className="writing-title">Citadel</h1>
            <div className="writing-decoration">
              <div className="dec-line"></div>
              <div className="dec-box"></div>
              <div className="dec-box"></div>
              <div className="dec-box"></div>
              <div className="dec-line"></div>
            </div>
          </div>

          <div className="writing-memo">
            <h2>{prompt.title}</h2>
            <div className="memo-header">
              <p><em>To: {prompt.to}</em></p>
              <p><em>Re: {prompt.re}</em></p>
            </div>
          </div>

          <div className="writing-section">
            <h3>Comments</h3>
            <div className="writing-box">
              <textarea
                value={writingResponse}
                onChange={(e) => setWritingResponse(e.target.value.slice(0, 200))}
                maxLength={200}
                placeholder="Enter your response..."
              />
              <p className="char-count">{writingResponse.length}/200 characters</p>
            </div>
          </div>

          <div className="timer-box">
            Time Remaining: {formatTime(timeRemaining)}
          </div>

          <button onClick={handleWritingSubmit} className="btn-primary btn-large">SUBMIT</button>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (screen === 'feedback') {
    return (
      <div className="screen">
        <div className="container">
          <p className="round-label">Event {round - 1} Complete</p>
          <h1>What Happened</h1>
          
          {lastRoundFeedback && (
            <div className="feedback-box">
              <p className="feedback-text">{lastRoundFeedback}</p>
            </div>
          )}

          <button
            onClick={() => setScreen('welcome')}
            disabled={!canContinue}
            className={canContinue ? 'btn-primary' : 'btn-disabled'}
          >
            {canContinue ? 'Start Next Round →' : 'Please wait...'}
          </button>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (screen === 'instructions') {
    return (
      <div className="screen">
        <div className="container">
          <h1>Event {round} Instructions</h1>
          <div className="info-box">
            <p>{instructions[round]}</p>
          </div>
          <button onClick={() => setScreen('strategy')} className="btn-primary">Start →</button>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="screen">
        <div className="container">
          <p className="round-label">Event {round}</p>
          <h1>Welcome, {teamName}</h1>
          <p className="subtitle">Review data before choosing strategy</p>
          <div className="button-group">
            <button onClick={() => { setViewedMarket(true); setScreen('marketdata'); }} className="btn-nav">Market Data →</button>
            <button onClick={() => { setViewedPlayers(true); setScreen('keyplayers'); }} className="btn-nav">Key Players →</button>
            <button 
              onClick={() => setScreen('instructions')} 
              disabled={!viewedMarket || !viewedPlayers} 
              className={viewedMarket && viewedPlayers ? 'btn-primary' : 'btn-disabled'}
            >
              Your Strategy →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Market Data Screen
  if (screen === 'marketdata') {
    const sharePrice = calculateSharePrice();
    const status = getSharePriceStatus(sharePrice);
    return (
      <div className="screen">
        <div className="container">
          <button onClick={() => setScreen('welcome')} className="back-btn">← Back</button>
          <h1>Market Data</h1>
          
          <div className="share-price-box">
            <p className="label">Share Price</p>
            <p className="price">{sharePrice} GBX</p>
          </div>

          <div className="status-box">
            <h2>{status.title}</h2>
            <p>{status.desc}</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <p className="metric-label">Innovation</p>
              <p className="metric-value">{gameState.innovation}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Financial</p>
              <p className="metric-value">{gameState.financial}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Reputation</p>
              <p className="metric-value">{gameState.reputation}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Strategic</p>
              <p className="metric-value">{gameState.strategic}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Key Players Screen
  if (screen === 'keyplayers') {
    if (selectedPlayer) {
      const p = players[selectedPlayer];
      return (
        <div className="screen">
          <div className="container">
            <button onClick={() => setSelectedPlayer(null)} className="back-btn">← Back</button>
            <div className="player-detail">
              <h1>{p.name}</h1>
              <p className="player-subtitle">{p.subtitle}</p>
              <div className="player-info">
                <div>
                  <p className="info-label">Values</p>
                  <p>{p.values}</p>
                </div>
                <div>
                  <p className="info-label">Drives</p>
                  <p>{p.drives}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="screen">
        <div className="container">
          <button onClick={() => setScreen('welcome')} className="back-btn">← Back</button>
          <h1>Key Players</h1>
          <div className="player-list">
            {Object.entries(players).map(([key, p]) => (
              <button key={key} onClick={() => setSelectedPlayer(key)} className="player-card">
                <p className="player-name">{p.name}</p>
                <p className="player-sub">{p.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Strategy Screen
  if (screen === 'strategy') {
    const strats = allStrategies[round] || [];
    const resourcesRemaining = totalAvailableResources - totalAllocated;

    return (
      <div className="screen">
        <div className="container">
          <button onClick={() => setScreen('welcome')} className="back-btn">← Back</button>
          <h1>Choose Your Strategy</h1>
          <div className="resources-box">
            <p className="resources-text">Resources: <span className="resources-number">{resourcesRemaining}</span></p>
          </div>
          <div className="strategy-list">
            {strats.map((strat) => {
              const currentAllocation = allocations[strat.id] || 0;
              const isSelected = selectedStrategies.includes(strat.id);
              return (
                <div key={strat.id} className={`strategy-card ${isSelected ? 'selected' : ''}`}>
                  <p className="strategy-title">{strat.title}</p>
                  <p className="strategy-type">{strat.type}</p>
                  <p className="strategy-desc">{strat.desc}</p>
                  <div className="allocation-controls">
                    <button
                      onClick={() => handleStrategyAllocationChange(strat.id, currentAllocation - 1)}
                      disabled={currentAllocation === 0}
                      className="btn-control"
                    >
                      −
                    </button>
                    <span className="allocation-value">{currentAllocation}</span>
                    <button
                      onClick={() => handleStrategyAllocationChange(strat.id, currentAllocation + 1)}
                      disabled={(!isSelected && selectedStrategies.length >= 2) || resourcesRemaining === 0}
                      className="btn-control btn-plus"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleSubmitStrategy}
            disabled={!canSubmit}
            className={canSubmit ? 'btn-primary' : 'btn-disabled'}
          >
            SUBMIT
          </button>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (screen === 'gameover') {
    const sharePrice = calculateSharePrice();
    const status = getSharePriceStatus(sharePrice);
    return (
      <div className="screen">
        <div className="container">
          <h1>Game Complete!</h1>
          
          <div className="share-price-box">
            <p className="label">Final Share Price</p>
            <p className="price">{sharePrice} GBX</p>
          </div>

          <div className="status-box">
            <h2>{status.title}</h2>
            <p>{status.desc}</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <p className="metric-label">Innovation</p>
              <p className="metric-value">{gameState.innovation}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Financial</p>
              <p className="metric-value">{gameState.financial}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Reputation</p>
              <p className="metric-value">{gameState.reputation}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Strategic</p>
              <p className="metric-value">{gameState.strategic}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setScreen('cookie');
              setTeamName('');
              setRound(0);
              setCarryOverResources(0);
              setGameState({ innovation: 100, financial: 100, reputation: 100, strategic: 100 });
              setSelectedStrategies([]);
              setAllocations({});
              setViewedMarket(false);
              setViewedPlayers(false);
            }}
            className="btn-primary"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;