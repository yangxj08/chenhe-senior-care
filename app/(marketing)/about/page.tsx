import Link from "next/link";
import { Heart, FlaskConical, Users, Lightbulb } from "lucide-react";

const milestones = [
  {
    year: "2018",
    title: "品牌创立",
    desc: "郴和养老在湖南郴州成立，以「让每一位长辈安享温暖晚年」为使命，开设首家直营旗舰机构。",
  },
  {
    year: "2019",
    title: "医养模式落地",
    desc: "与郴州市第一人民医院签署战略合作，率先在湖南落地「医养结合」一体化服务模式。",
  },
  {
    year: "2020",
    title: "智慧系统上线",
    desc: "自研智慧养老管理系统正式投用，IoT健康监测、家属APP、数字化档案三位一体。",
  },
  {
    year: "2021",
    title: "加盟体系建立",
    desc: "推出标准化加盟合作模式，首批5个城市合作伙伴落地，全年新增床位逾200张。",
  },
  {
    year: "2022",
    title: "区域扩张提速",
    desc: "布局城市突破10个，累计服务长辈超过3000位，客户满意度持续保持98%以上。",
  },
  {
    year: "2023",
    title: "国家试点认定",
    desc: "被纳入国家医养结合试点项目，并荣获民政部「优质养老服务品牌」称号。",
  },
  {
    year: "2024",
    title: "战略升级",
    desc: "发布「郴和养老2.0」战略，向全国一线及新一线城市加速扩张，目标三年100家机构。",
  },
];

const coreValues = [
  {
    icon: Heart,
    title: "以人为本",
    desc: "以长辈的尊严与幸福为一切工作的出发点，提供有温度的专业服务。",
  },
  {
    icon: FlaskConical,
    title: "专业精进",
    desc: "持续提升医疗资质与护理水平，每年投入营收的8%用于团队培训与技术研发。",
  },
  {
    icon: Users,
    title: "诚信共赢",
    desc: "与加盟伙伴、长辈家庭、合作医院建立长期信任关系，共同创造社会价值。",
  },
  {
    icon: Lightbulb,
    title: "创新驱动",
    desc: "积极拥抱智慧养老科技，用数字化手段不断提升服务效率与品质。",
  },
];

const leadershipTeam = [
  {
    name: "陈建国",
    title: "创始人 & CEO",
    avatar: "陈",
    bio: "前三甲医院院长，从业医疗健康行业22年，深刻洞察医养结合市场机遇，2018年创立郴和养老。",
  },
  {
    name: "李晓梅",
    title: "联合创始人 & COO",
    avatar: "李",
    bio: "拥有15年养老机构管理经验，主导建立郴和养老标准化运营体系，推动全国加盟网络快速落地。",
  },
  {
    name: "王志远",
    title: "首席医疗官 CMO",
    avatar: "王",
    bio: "主任医师，曾任湘雅医院老年科主任，领导医养结合服务方案设计，保障专业医疗水准。",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero 区 ── */}
      <section
        className="relative py-24 lg:py-32 flex items-center"
        style={{
          background: "linear-gradient(135deg, #1a2e45 0%, #2E75B6 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(232,168,56,0.2)", color: "#E8A838" }}
          >
            关于我们
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            用专业与温情，
            <br />
            守护长辈的幸福晚年
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            郴和养老成立于2018年，扎根湖南，辐射全国，是一家专注医养结合的高品质连锁养老服务机构。我们相信：晚年可以精彩，老去可以尊严。
          </p>
        </div>
      </section>

      {/* ── 使命 & 愿景 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#E8A838" }}
              >
                使命与愿景
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                我们为何而存在
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-lg"
                    style={{ backgroundColor: "#2E75B6" }}
                  >
                    使
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">使命</h3>
                    <p className="text-gray-500 leading-relaxed">
                      让每一位长辈都能安享有尊严、有温度、有保障的幸福晚年，让每一个家庭都能找到值得信赖的养老伙伴。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-lg"
                    style={{ backgroundColor: "#E8A838" }}
                  >
                    愿
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">愿景</h3>
                    <p className="text-gray-500 leading-relaxed">
                      成为中国最受信赖的医养结合养老服务品牌，用5年时间布局100个城市，服务100万长辈及家庭。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-sm"
                    style={{ backgroundColor: "#1a2e45" }}
                  >
                    价值
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">核心价值观</h3>
                    <p className="text-gray-500 leading-relaxed">
                      以人为本 · 专业精进 · 诚信共赢 · 创新驱动
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "6年+", desc: "深耕养老行业" },
                { num: "500+", desc: "在住长辈" },
                { num: "200+", desc: "专业护理人员" },
                { num: "10+", desc: "布局城市" },
              ].map((item) => (
                <div
                  key={item.desc}
                  className="p-6 rounded-2xl text-center"
                  style={{ backgroundColor: "#f0f6ff" }}
                >
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: "#2E75B6" }}
                  >
                    {item.num}
                  </div>
                  <div className="text-gray-600 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 创始故事 ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              创始故事
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">初心来自一段经历</h2>
          </div>
          <div
            className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border-l-4"
            style={{ borderLeftColor: "#2E75B6" }}
          >
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              创始人陈建国曾任职三甲医院22年。2016年，他的父亲因病需要长期照护，他跑遍郴州所有养老机构，却发现：
              <strong className="text-gray-800">要么环境好但护理跟不上，要么有医疗但氛围冷漠。</strong>
              最好的选择，依然不够好。
            </p>
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              那两年的切身体验，让他下定决心：用医疗从业者的专业标准、用儿女的温情视角，
              亲手打造一家真正值得托付的养老机构。2018年，郴和养老在郴州正式开业，
              首期50张床位，开业当月入住率超过80%。
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              从一家机构到连锁品牌，初心始终未变——
              <strong className="text-[#2E75B6]">我们做的，是自己愿意把父母送来的养老。</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── 发展历程时间线 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              发展历程
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">每一步，都在向前</h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5 hidden sm:block"
              style={{ backgroundColor: "#E8E8E8" }}
            />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 relative">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs z-10"
                      style={{ backgroundColor: i === milestones.length - 1 ? "#E8A838" : "#2E75B6" }}
                    >
                      {m.year.slice(2)}
                    </div>
                  </div>
                  <div className="pb-8 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: "#f0f6ff", color: "#2E75B6" }}
                      >
                        {m.year}
                      </span>
                      <h3 className="font-bold text-gray-900">{m.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 核心价值观 ── */}
      <section className="py-20" style={{ backgroundColor: "#f0f6ff" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">核心价值观</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  <v.icon className="w-10 h-10 text-[#2E75B6]" />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "#2E75B6" }}
                >
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 管理团队 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              核心团队
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              专业团队，可信赖的伙伴
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((person) => (
              <div
                key={person.name}
                className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                  style={{ backgroundColor: "#2E75B6" }}
                >
                  {person.avatar}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "#E8A838" }}
                >
                  {person.title}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section
        className="py-16 text-center"
        style={{ backgroundColor: "#1a2e45" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            与我们携手，共创美好银发未来
          </h2>
          <p className="text-blue-200 mb-8">
            无论是寻找优质养老服务，还是寻求加盟合作机会，我们随时欢迎您的到来。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#E8A838" }}
            >
              联系我们
            </Link>
            <Link
              href="/franchise"
              className="px-8 py-3 rounded-xl font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            >
              了解加盟
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
