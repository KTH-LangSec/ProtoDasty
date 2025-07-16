import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backends.backend_pdf import PdfPages
import statistics


def tool_exec(pkg, y):
    colors = ['#3D9255', '#F45050', '#FFC107', '#512DA8']
    width = 0.65

    if (y[2] > y[1]):
        y1 = [0, 0, y[1], y[2]]
        y2 = [y[0], y[1], y[2] - y[1], y[3] - y[2]]
    else:
        y1 = [0, 0, 0, y[2]]
        y2 = [y[0], y[1], y[2], y[3] - y[2]]
        

    plt.title('Performance Overhead - ' + pkg)
    plt.ylabel('Execution Time (in seconds)')
    x = ['V8 Node.js', 'Graal Node.js', 'NodeProf', 'Analysis']

    plt.bar(x, y1, color='#C3C3C3', width=width)
    top_bar = plt.bar(x, y2, bottom=y1, color=colors, width=width)

    top = max(y) * 1.1  # add some space at the top for labels
    plt.ylim(top=top)
    height_diff = top * 0.01

    for bar_idx, bar in enumerate(top_bar):
        plt.text(bar.get_x() + bar.get_width() / 2, y[bar_idx] + height_diff, str(y[bar_idx]) + 's', ha='center', va='bottom')

    # plt.show()
    print("Saving", pkg)
    plt.savefig('overhead-' + pkg + '.png', dpi=600)
    # pdf = PdfPages('overhead-' + pkg + '.pdf')
    # pdf.savefig()
    # pdf.close()
    plt.close()


def comp(x_labels, the_tool, augur, bar_labels, filename):
    # x = ['small.js', 'gm', 'fs-extra', 'express']
    x = np.arange(len(x_labels))
    width = 0.25

    bars = []
    ax = plt.subplot(111)
    bars.append(ax.bar(x, the_tool, width=width, color='#512DA8'))
    bars.append(ax.bar(x + width, augur, width=width, color='#F45050'))

    ax.legend(bars, ('Dasty', 'Augur'))

    plt.xlabel('Packages')
    plt.ylabel('Execution Time (in seconds)')

    ax.set_xticks(x + width / 2)
    ax.set_xticklabels(x_labels)

    top = max(max(the_tool), max(augur)) * 1.4
    plt.ylim(top=top)

    height_diff = top * 0.01

    for b_idx, b in enumerate(bars):
        for bar_idx, bar in enumerate(b):
            plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + height_diff, bar_labels[b_idx][bar_idx], ha='center', va='bottom')

    # plt.show()
    plt.savefig(filename + '.png', dpi=600)
    # pdf = PdfPages(filename)
    # pdf.savefig()
    # pdf.close()
    plt.close()


def perf_ratio(data):
    d = []
    for i in range(len(data) - 1):
        d.append(data[i + 1] / data[i])
    return d


def main():
    small = [0.035, 1.504, 2.327, 2.888]
    tool_exec(
        'small',
        small
    )

    express = [22.97, 244.05, 323.04, 805.84]
    tool_exec(
        'uglify-js',
        express
    )

    gm = [0.473, 3.8, 5.536, 7.622]
    tool_exec(
        'gm',
        gm
    )

    fs_extra = [5.721, 13.549, 18.788, 36.529]
    tool_exec(
        'fs-extra',
        fs_extra
    )

    print('Performance Ratio')
    print('small')
    d_small = perf_ratio(small)
    print(d_small)

    print('gm')
    d_gm = perf_ratio(gm)
    print(d_gm)

    print('fs-extra')
    d_fs = perf_ratio(fs_extra)
    print(d_fs)

    print('expess')
    d_express = perf_ratio(express)
    print(d_express)

    d_avg = []
    for i in range(3):
        d_avg.append((d_small[i] + d_gm[i] + d_fs[i] + d_express[i]) / 4)
    print(d_avg)

    # the_tool_small = [2.32, 5.37]
    # augur_small = [3.42, 23.21]
    # the_tool_big = [25.1, 165.29]
    # augur_big = [300, 300]

    # overhead_small = ((augur_small[0] / the_tool_small[0]) + (augur_small[1] / the_tool_small[0])) / 2
    # overhead_big = ((augur_big[0] / the_tool_big[0]) + (augur_big[1] / the_tool_big[0])) / 2
    # overhead_avg = (overhead_big + overhead_small) / 2
    # print(overhead_small)
    # print(overhead_big)
    # print(overhead_avg)

    # comp(
    #     ['small.js', 'gm'],
    #     the_tool=the_tool_small,
    #     augur=augur_small,
    #     bar_labels=[
    #         ['2.35s', '5.37s'],
    #         ['3.42s', '23.21s']
    #     ],
    #     filename='comp-small.pdf'
    # )

    # comp(
    #     ['fs-extra', 'express'],
    #     the_tool=the_tool_big,
    #     augur=augur_big,
    #     bar_labels=[
    #         ['25.1s', '165.29s'],
    #         ['300s (timeout)', '300s (timeout)']
    #     ],
    #     filename='comp-big.pdf'
    # )


if __name__ == '__main__':
    main()
